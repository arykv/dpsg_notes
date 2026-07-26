"""Build a verified chapterwise index of NCERT Class 11/12 books.

Every entry here is probed against ncert.nic.in and its title is read out of the
actual PDF, so the catalogue matches the current rationalised syllabus rather
than whatever the chapter list used to be.
"""

import io
import json
import pathlib
import re
import subprocess
import sys
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


def fetch(url: str, timeout: int = 45) -> bytes | None:
    """Shell out to curl — this machine sits behind a TLS-intercepting proxy
    that Python's own certificate store doesn't trust, but the system one does."""
    try:
        r = subprocess.run(
            ["curl", "-sL", "--max-time", str(timeout), "-A", UA["User-Agent"], url],
            capture_output=True,
        )
        data = r.stdout
        return data if data[:4] == b"%PDF" else None
    except Exception:
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
    code, ch = args
    data = fetch(BASE.format(code=code, ch=ch))
    if not data:
        return None
    title, pages = title_from(data)
    return {
        "ch": ch,
        "title": clean(title) if title else f"Chapter {ch}",
        "pages": pages,
        "sizeMb": round(len(data) / 1_048_576, 1),
        "guessed": title is None,
    }


def main():
    jobs = [(code, ch) for code, *_ in BOOKS for ch in range(1, 21)]
    with ThreadPoolExecutor(max_workers=24) as pool:
        results = list(pool.map(do_chapter, jobs))

    by_code: dict[str, list] = {}
    for (code, _ch), res in zip(jobs, results):
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
            if c["ch"] in toc:
                c["title"] = toc[c["ch"]]
                c["guessed"] = False
            elif c["guessed"] or not c["title"] or re.search(r"\d", c["title"][:3]):
                # No trustworthy title anywhere — say so plainly rather than
                # shipping a mangled one.
                c["title"] = f"Chapter {c['ch']}"
                c["guessed"] = True
            c.pop("guessed", None)

        out.append({
            "code": code, "grade": grade, "subject": subject,
            "stream": stream, "label": label, "chapters": chapters,
        })
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
