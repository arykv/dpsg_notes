"""Build a verified chapterwise index of NCERT Class 11/12 books.

Every entry here is probed against ncert.nic.in and its title is read out of the
actual PDF, so the catalogue matches the current rationalised syllabus rather
than whatever the chapter list used to be.
"""

import collections
import io
import json
import pathlib
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor

from pypdf import PdfReader

BASE = "https://ncert.nic.in/textbook/pdf/{code}{ch:02d}.pdf"
UA = {"User-Agent": "Mozilla/5.0"}

# (book code, class, subject id, stream, book label)
BOOKS = [
    ("keph1", 11, "physics", "science", "Part I"),
    ("keph2", 11, "physics", "science", "Part II"),
    ("kech1", 11, "chemistry", "science", "Part I"),
    ("kech2", 11, "chemistry", "science", "Part II"),
    ("kemh1", 11, "maths", "science", ""),
    ("kebo1", 11, "biology", "science", ""),
    ("kecs1", 11, "computer-science", "science", ""),
    ("keip1", 11, "computer-science", "science", "Informatics Practices"),
    ("keac1", 11, "accountancy", "commerce", "Part I"),
    ("keac2", 11, "accountancy", "commerce", "Part II"),
    ("kebs1", 11, "business-studies", "commerce", ""),
    ("keec1", 11, "economics", "commerce", "Indian Economic Development"),
    ("kest1", 11, "economics", "commerce", "Statistics for Economics"),
    ("kehs1", 11, "history", "arts", "Themes in World History"),
    ("keps1", 11, "political-science", "arts", "Indian Constitution at Work"),
    ("keps2", 11, "political-science", "arts", "Political Theory"),
    ("kepy1", 11, "psychology", "arts", ""),
    ("kehb1", 11, "english", "common", "Hornbill"),
    ("kesp1", 11, "english", "common", "Snapshots"),
    ("leph1", 12, "physics", "science", "Part I"),
    ("leph2", 12, "physics", "science", "Part II"),
    ("lech1", 12, "chemistry", "science", "Part I"),
    ("lech2", 12, "chemistry", "science", "Part II"),
    ("lemh1", 12, "maths", "science", "Part I"),
    ("lemh2", 12, "maths", "science", "Part II"),
    ("lebo1", 12, "biology", "science", ""),
    ("lecs1", 12, "computer-science", "science", ""),
    ("leip1", 12, "computer-science", "science", "Informatics Practices"),
    ("leac1", 12, "accountancy", "commerce", "Part I"),
    ("leac2", 12, "accountancy", "commerce", "Part II"),
    ("lebs1", 12, "business-studies", "commerce", "Part I"),
    ("lebs2", 12, "business-studies", "commerce", "Part II"),
    ("leec1", 12, "economics", "commerce", "Introductory Microeconomics"),
    ("leec2", 12, "economics", "commerce", "Introductory Macroeconomics"),
    ("lehs1", 12, "history", "arts", "Themes in Indian History I"),
    ("lehs2", 12, "history", "arts", "Themes in Indian History II"),
    ("lehs3", 12, "history", "arts", "Themes in Indian History III"),
    ("leps1", 12, "political-science", "arts", "Contemporary World Politics"),
    ("leps2", 12, "political-science", "arts", "Politics in India since Independence"),
    ("lepy1", 12, "psychology", "arts", ""),
    ("lefl1", 12, "english", "common", "Flamingo"),
    ("levt1", 12, "english", "common", "Vistas"),
]

NOISE = re.compile(
    r"^(reprint|rationalised|©|ncert|not to be republished|\d+$|chapter\b)", re.I
)


def fetch(url: str, timeout: int = 60, attempts: int = 4) -> bytes | None:
    """Shell out to curl — this machine sits behind a TLS-intercepting proxy
    that Python's own certificate store doesn't trust, but the system one does.

    Retries matter: a single dropped connection used to delete a real chapter
    from the index, which looks identical to the chapter not existing.
    """
    for attempt in range(attempts):
        try:
            r = subprocess.run(
                ["curl", "-sL", "--max-time", str(timeout), "-A", UA["User-Agent"], url],
                capture_output=True,
            )
            data = r.stdout
            if data[:4] == b"%PDF":
                # A truncated download still starts with %PDF, so the header is
                # not enough — without the trailing %%EOF the text layer comes
                # out garbled and every title from it is junk. Retry instead.
                if b"%%EOF" in data[-2048:]:
                    return data
                continue
            # A missing chapter answers with a few bytes of non-PDF. Only an
            # empty body means the connection actually dropped, so that's the
            # only case worth retrying.
            if data:
                return None
        except Exception:
            pass
        time.sleep(1 + attempt)
    return None


def title_from(data: bytes) -> tuple[str | None, int]:
    """Pull the chapter heading off the first page."""
    try:
        reader = PdfReader(io.BytesIO(data))
        pages = len(reader.pages)
        text = reader.pages[0].extract_text() or ""
    except Exception:
        return None, 0

    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    for i, ln in enumerate(lines[:12]):
        # "CHAPTER ONE" / "CHAPTER 3" is followed by the actual title.
        if re.match(r"^chapter\s+(\w+)$", ln, re.I):
            for cand in lines[i + 1 : i + 4]:
                if not NOISE.match(cand) and len(cand) > 2:
                    return cand, pages
    # Some books lead with the title in caps and no CHAPTER line.
    for ln in lines[:6]:
        if not NOISE.match(ln) and 3 < len(ln) < 70 and ln.upper() == ln:
            return ln, pages
    return None, pages


PAGE_NUM = re.compile(r"^\s*\d{1,3}\s*|\s*\d{1,3}\s*$")
CH_PREFIX = re.compile(r"^\s*chapter\s*\d+\s*[•·\-–]?\s*", re.I)


def undouble(t: str) -> str:
    """Drop-shadow text extracts twice: "TitleTitle" -> "Title"."""
    half = len(t) // 2
    if len(t) % 2 == 0 and t[:half] == t[half:]:
        return t[:half]
    return t


def header_title(reader: PdfReader, book_label: str) -> str | None:
    """The running header on odd pages is the chapter title in most NCERT books.

    Even pages carry the book name instead, so only odd ones are sampled and the
    most repeated candidate wins.
    """
    seen: dict[str, int] = {}
    for i in (2, 4, 6, 8):
        if i >= len(reader.pages):
            break
        text = reader.pages[i].extract_text() or ""
        lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
        if not lines:
            continue
        cand = CH_PREFIX.sub("", PAGE_NUM.sub("", lines[0])).strip(" .:-—•")
        cand = undouble(re.sub(r"\s+", " ", cand))
        if not (3 < len(cand) < 70):
            continue
        if book_label and cand.lower() in book_label.lower():
            continue
        if NOISE.match(cand) or cand.isdigit():
            continue
        seen[cand] = seen.get(cand, 0) + 1

    if not seen:
        return None
    best, count = max(seen.items(), key=lambda kv: kv[1])
    return best if count >= 2 else None


def clean(t: str) -> str:
    t = re.sub(r"\s+", " ", t).strip(" .:-—")
    if t.isupper() or t.islower():
        t = t.title()
    # Fix the small words title() over-capitalises.
    for w in (" And ", " Of ", " The ", " In ", " To ", " A ", " On ", " For ", " With "):
        t = t.replace(w, w.lower())
    return t


TOC_LINE = re.compile(
    r"^\s*(?:chapter|unit)\s+(\d{1,2})\s+(.+?)\s+\d{1,3}\s*$", re.I
)
TOC_NUMBERED = re.compile(r"^\s*(\d{1,2})\.\s+(.+?)\s+\d{1,3}\s*$")


def toc_titles(code: str) -> dict[int, str]:
    """Chapter titles from the book's own contents page.

    Reading the first page of each chapter only works when the heading is live
    text; in a lot of these books it's outlined artwork. The prelims PDF
    (`<code>ps.pdf`) lists every chapter as plain text, so it's the better
    source wherever it exists.
    """
    data = fetch(f"https://ncert.nic.in/textbook/pdf/{code}ps.pdf")
    if not data:
        return {}
    try:
        reader = PdfReader(io.BytesIO(data))
    except Exception:
        return {}

    found: dict[int, str] = {}
    for page in reader.pages:
        text = page.extract_text() or ""
        if not re.search(r"\bcontents\b", text, re.I):
            continue
        for line in text.splitlines():
            m = TOC_LINE.match(line) or TOC_NUMBERED.match(line)
            if not m:
                continue
            n, title = int(m.group(1)), m.group(2)
            # Sub-headings like "1.4 Role of Accounting" are not chapters.
            if re.match(r"^\d", title) or len(title) < 3:
                continue
            found.setdefault(n, clean(title))
    return found


def do_chapter(args):
    code, ch, label = args
    data = fetch(BASE.format(code=code, ch=ch))
    if not data:
        return None
    title, pages = title_from(data)

    running = None
    try:
        running = header_title(PdfReader(io.BytesIO(data)), label)
    except Exception:
        pass

    return {
        "ch": ch,
        "title": clean(title) if title else "",
        "running": clean(running) if running else "",
        "pages": pages,
        "sizeMb": round(len(data) / 1_048_576, 1),
    }


# Suffixes that only ever appear as the tail of a longer word.
FRAGMENT = re.compile(
    r"\b(a?tions?|atives?|ives|ments?|ness|sions?|ances?|ences?|ity|ical|ology|ing)\b",
    re.I,
)

SAFE_CHARS = re.compile(r"[A-Za-z0-9 ,.'’\-–—:;()&/?!]")


SUBJECT_NAMES = {
    "physics": "Physics", "chemistry": "Chemistry", "maths": "Mathematics",
    "biology": "Biology", "computer-science": "Computer Science", "english": "English",
    "accountancy": "Accountancy", "business-studies": "Business Studies",
    "economics": "Economics", "history": "History",
    "political-science": "Political Science", "psychology": "Psychology",
}
STOP = {"a", "an", "and", "as", "at", "by", "for", "from", "in", "into", "is",
        "of", "on", "or", "the", "to", "with", "its"}
JUNK = {"notes", "contents", "index", "appendix", "glossary", "answers",
        "preface", "foreword"}


def join_split_letters(t: str) -> str:
    """"Gravit a Tion" -> "Gravitation".

    Letter-spaced display type extracts with spaces inside words. Only stray
    single letters are rejoined — "a" and "I" are real words and are left alone,
    or "Motion in a Plane" would become "Motion inaPlane".
    """
    prev = None
    while prev != t:
        prev = t
        t = re.sub(
            r"\b([A-Za-z]{2,})\s+([b-hj-z])\s+([A-Za-z]{2,})\b",
            lambda m: m.group(1) + m.group(2) + m.group(3),
            t,
        )
    return t


def fix_inner_caps(t: str) -> str:
    """"The LasT Lesson" -> "The Last Lesson".

    Small-caps headings extract with the capitals still encoded, so a capital
    turns up mid-word. All-caps tokens are left alone — they're acronyms.
    """
    def word(m: "re.Match[str]") -> str:
        w = m.group(0)
        if w.isupper() or w.islower():
            return w
        if len(w) > 1 and re.search(r"[A-Z]", w[1:]):
            return w[0].upper() + w[1:].lower()
        return w

    return re.sub(r"[A-Za-z]+", word, t)


def titlecase(t: str) -> str:
    words = t.split()
    out = []
    for i, w in enumerate(words):
        if not re.match(r"^[A-Za-z]", w):
            out.append(w)
        elif i > 0 and w.lower() in STOP:
            out.append(w.lower())
        else:
            out.append(w[0].upper() + w[1:])
    return " ".join(out)


def messy_case(t: str) -> bool:
    words = [w for w in t.split() if re.match(r"^[A-Za-z]{2,}$", w)]
    if len(words) < 2:
        return False
    lower = sum(1 for w in words[1:] if w[0].islower() and w.lower() not in STOP)
    return lower > 0 and any(w[0].isupper() for w in words)


def tidy_book(book: dict) -> None:
    """Drop titles that are really the book's own running header, then normalise.

    A "chapter title" that shows up on several chapters of the same book is the
    header printed on every page, not a chapter name.
    """
    subject = SUBJECT_NAMES.get(book["subject"], "")
    banned = {subject.lower(), book["label"].lower()}
    banned |= {f"{subject} part {n}".lower() for n in ("i", "ii", "iii")}

    counts = collections.Counter(c["title"].lower() for c in book["chapters"])
    repeated = {t for t, n in counts.items() if n > 2 and not t.startswith("chapter ")}

    for c in book["chapters"]:
        low = c["title"].lower().strip()
        if (
            low in banned
            or low in repeated
            or low in JUNK
            or c["title"].startswith("/")
            or (subject and low.startswith(subject.lower()))
            or len(low) < 3
        ):
            c["title"] = f"Chapter {c['ch']}"
            continue
        if c["title"].startswith("Chapter "):
            continue
        t = fix_inner_caps(join_split_letters(c["title"]))
        if messy_case(t):
            t = titlecase(t)
        c["title"] = re.sub(r"\s+", " ", t).strip()


def looks_like_title(t: str) -> bool:
    """Reject anything that would look broken on the page.

    Some of these PDFs use subsetted display fonts with no usable encoding, so
    the "title" comes out as a run of tofu. A wrong-looking title is worse than
    an honest "Chapter 7", so the bar here is deliberately high.
    """
    if not t or not (3 <= len(t) <= 70):
        return False
    if re.match(r"^\d", t):          # "18 Mathematics"
        return False
    if re.search(r"\d{2,}$", t):     # "Themes in Indian History28"
        return False
    if len(SAFE_CHARS.findall(t)) < len(t) * 0.9:
        return False
    if not re.search(r"[A-Za-z]{3}", t):
        return False
    # "Gravit a Tion" / "Deriv Atives" — letter-spaced display type breaks words
    # apart, and rejoining is unsafe because "a" and "I" are real words. A
    # leftover fragment is the tell; fall back to "Chapter N" instead.
    if re.search(r"\b[b-hj-z]\b", t):
        return False
    if re.search(FRAGMENT, t):
        return False
    return True


def main():
    label_of = {code: label for code, _g, _s, _st, label in BOOKS}
    jobs = [(code, ch, label_of[code]) for code, *_ in BOOKS for ch in range(1, 21)]
    with ThreadPoolExecutor(max_workers=20) as pool:
        results = list(pool.map(do_chapter, jobs))

    by_code: dict[str, list] = {}
    for (code, _ch, _l), res in zip(jobs, results):
        if res:
            by_code.setdefault(code, []).append(res)

    codes = [b[0] for b in BOOKS]
    with ThreadPoolExecutor(max_workers=12) as pool:
        tocs = dict(zip(codes, pool.map(toc_titles, codes)))

    out = []
    for code, grade, subject, stream, label in BOOKS:
        chapters = sorted(by_code.get(code, []), key=lambda c: c["ch"])
        if not chapters:
            print(f"  --  {code}: none", file=sys.stderr)
            continue

        toc = tocs.get(code, {})
        for c in chapters:
            # Contents page first, then the running header, then the page-1
            # heading. Anything that still looks mangled becomes "Chapter N".
            for cand in (toc.get(c["ch"]), c["running"], c["title"]):
                if cand and looks_like_title(cand):
                    c["title"] = cand
                    break
            else:
                c["title"] = f"Chapter {c['ch']}"
            c.pop("running", None)

        book = {
            "code": code, "grade": grade, "subject": subject,
            "stream": stream, "label": label, "chapters": chapters,
        }
        tidy_book(book)
        out.append(book)
        named = sum(1 for c in chapters if not c["title"].startswith("Chapter "))
        print(f"  ok  {code}: {len(chapters)} chapters, {named} titled", file=sys.stderr)

    out_path = pathlib.Path(__file__).resolve().parent.parent / "src" / "data" / "ncert.json"
    with out_path.open("w") as f:
        json.dump(out, f, indent=1)
    total = sum(len(b["chapters"]) for b in out)
    titled = sum(1 for b in out for c in b["chapters"] if not c["title"].startswith("Chapter "))
    print(f"\n{len(out)} books, {total} chapters, {titled} titled")


if __name__ == "__main__":
    main()
