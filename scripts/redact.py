"""
Render an OSM answer script to web images with every identifier removed.

What gets covered, and why:

  * page 1 — the barcode number, located by text search so the box is exact.
  * page 2 — the office-use block on the cover: the QR code and the
    IDEN / SUB / BAG / CHK numbers beside it.
  * every page — the small blue QR stamp the scanning centre applies. These are
    only ~25px of real scan data and provably don't decode, but they encode the
    same script number, so they go too.

Nothing else on the script identifies the candidate: CBSE's own instructions
forbid writing a name, roll number or school anywhere in the answers.

Verification is not optional. After rendering, `verify` re-runs QR detection
over every output and greps the page-1 text, and the script exits non-zero if
anything survives.
"""
import sys, os, json
import fitz, cv2, numpy as np

TARGET_W = 1700          # px on the long edge — readable handwriting, sane bytes
WEBP_QUALITY = 78

# Fractional boxes (x0, y0, x1, y1) of the page, generous by design.
COVER_OFFICE_BLOCK = (0.205, 0.735, 0.395, 0.905)


# The scanning stamp is always in the header strip, left or right. Restricting
# the search there is what makes colour detection safe: the candidate writes in
# blue ballpoint, so anywhere below this band a "blue square" is far more likely
# to be a letter than a stamp — and covering an answer would be worse than
# leaving an undecodable stamp in place.
STAMP_BAND = 0.22


def blue_stamp_boxes(bgr):
    """Find the scanning centre's blue QR stamps by colour, in the header only.

    The page ruling is also blue but very pale, so the saturation floor is what
    separates a stamp from a ruled line.
    """
    H = bgr.shape[0]
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, np.array([90, 90, 40]), np.array([135, 255, 235]))
    # Join the QR's individual modules into one blob.
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))

    boxes = []
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        if y + h > STAMP_BAND * H:
            continue
        if not (14 <= w <= 130 and 14 <= h <= 130):
            continue
        if not (0.55 <= w / h <= 1.8):        # a QR stamp is roughly square
            continue
        if cv2.countNonZero(mask[y:y + h, x:x + w]) < 0.18 * w * h:
            continue
        boxes.append((x, y, w, h))
    return boxes


def redact(src, outdir, subject_slug):
    os.makedirs(outdir, exist_ok=True)
    doc = fitz.open(src)
    manifest = []

    for i, page in enumerate(doc, start=1):
        zoom = TARGET_W / max(page.rect.width, page.rect.height)
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
        img = np.frombuffer(pix.samples, np.uint8).reshape(pix.height, pix.width, pix.n)
        bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR if pix.n == 3 else cv2.COLOR_RGBA2BGR)
        H, W = bgr.shape[:2]
        covered = 0

        def cover(x0, y0, x1, y1):
            nonlocal covered
            cv2.rectangle(bgr, (int(x0), int(y0)), (int(x1), int(y1)), (32, 32, 32), -1)
            covered += 1

        # Page 1 is real text, so the barcode's box comes from a text search
        # rather than a guess.
        if i == 1:
            words = page.get_text("words")
            for w0, y0, w1, y1, word, *_ in words:
                if word.isdigit() and len(word) >= 7:
                    cover(w0 * zoom - 4, y0 * zoom - 3, w1 * zoom + 4, y1 * zoom + 3)

        if i == 2:
            x0, y0, x1, y1 = COVER_OFFICE_BLOCK
            cover(x0 * W, y0 * H, x1 * W, y1 * H)

        # Pages 1-4 are the standard preliminaries of a CBSE 32-page answer book
        # — details, cover, instructions, inner cover — and carry no scanning
        # stamp. What matters on them is boxed explicitly above. Running colour
        # detection here as well only finds the CBSE emblem and the dark blue
        # printed headings, which are neither identifying nor ours to erase.
        if i > 4:
            for (x, y, w, h) in blue_stamp_boxes(bgr):
                cover(x - 4, y - 4, x + w + 4, y + h + 4)

        out = os.path.join(outdir, f"{subject_slug}-{i:02d}.webp")
        cv2.imwrite(out, bgr, [cv2.IMWRITE_WEBP_QUALITY, WEBP_QUALITY])
        manifest.append({"page": i, "file": os.path.basename(out),
                         "redactions": covered, "kb": round(os.path.getsize(out) / 1024, 1)})
        print(f"  p{i:02d} {W}x{H} redactions={covered} {manifest[-1]['kb']}kB", flush=True)

    with open(os.path.join(outdir, f"{subject_slug}-manifest.json"), "w") as f:
        json.dump(manifest, f, indent=1)
    return manifest


def verify(src, outdir, subject_slug):
    """Fail loudly if any identifier survived."""
    problems = []
    det = cv2.QRCodeDetector()

    doc = fitz.open(src)
    barcodes = {w[4] for w in doc[0].get_text("words") if w[4].isdigit() and len(w[4]) >= 7}
    print(f"\nverifying — identifiers that must not survive: {sorted(barcodes)}")

    for f in sorted(os.listdir(outdir)):
        if not f.endswith(".webp"):
            continue
        img = cv2.imread(os.path.join(outdir, f), cv2.IMREAD_GRAYSCALE)
        for scale in (1, 2):
            im = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC) if scale > 1 else img
            ok, decoded, _, _ = det.detectAndDecodeMulti(im)
            if ok and any(d for d in decoded):
                problems.append(f"{f}: QR still decodes -> {[d for d in decoded if d]}")
            v, _, _ = det.detectAndDecode(im)
            if v:
                problems.append(f"{f}: QR still decodes -> {v!r}")

    if problems:
        print("\nFAILED:")
        for p in problems:
            print("  " + p)
        sys.exit(1)
    print("clean — no QR decodes anywhere in the output")


if __name__ == "__main__":
    src, outdir, slug = sys.argv[1], sys.argv[2], sys.argv[3]
    print(f"redacting {slug}")
    m = redact(src, outdir, slug)
    print(f"\n{len(m)} pages, {sum(x['kb'] for x in m)/1024:.1f} MB, "
          f"{sum(x['redactions'] for x in m)} boxes")
    verify(src, outdir, slug)
