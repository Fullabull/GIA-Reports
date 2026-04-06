import os
import sys
import re
from pathlib import Path

FOOTER_HTML = '<footer class="site-footer">&copy; 2026 Technology Solutions of WA. All rights reserved.</footer>'
FOOTER_TEXT = 'Technology Solutions of WA. All rights reserved.'

def already_has_footer(text: str) -> bool:
    return FOOTER_HTML in text

def normalize_footer(text: str) -> str:
    pattern = re.compile(
        r'<footer\b[^>]*>\s*(?:&copy;|&#169;|©|�)?\s*2026\s+Technology Solutions of WA\.\s+All rights reserved\.\s*</footer>',
        re.IGNORECASE
    )
    return pattern.sub(FOOTER_HTML, text)

def insert_footer(text: str) -> str:
    lower = text.lower()
    idx = lower.rfind("</body>")
    if idx == -1:
        return text
    return text[:idx] + "\n  " + FOOTER_HTML + "\n" + text[idx:]

def iter_html_files(target: Path):
    if target.is_file():
        if target.suffix.lower() == ".html":
            yield target
        return
    if target.is_dir():
        yield from target.rglob("*.html")

def main():
    gia = os.environ.get("GIA", "").strip()
    if not gia:
        raise SystemExit("ERROR: %GIA% is not set.")

    args = sys.argv[1:]
    stdout_mode = any(a.lower() == "stdout" for a in args)
    args = [a for a in args if a.lower() != "stdout"]

    if args:
        target = Path(args[0])
        if not target.is_absolute():
            target = Path(gia) / target
    else:
        target = Path(gia) / "docs"

    if not target.exists():
        raise SystemExit(f"ERROR: Not found: {target}")

    # SAFETY CHECK (only for full-docs write)
    if not stdout_mode and not args:
        print(f"\nAbout to modify ALL HTML files under:\n{target}\n")
        confirm = input("Type YES to continue: ").strip()
        if confirm != "YES":
            print("Aborted.")
            return

    changed = 0
    skipped = 0

    for path in iter_html_files(target):
        text = path.read_text(encoding="utf-8", errors="replace")

        if already_has_footer(text):
            skipped += 1
            continue

        normalized_text = normalize_footer(text)

        if normalized_text != text:
            new_text = normalized_text
        else:
            new_text = insert_footer(text)

        if new_text == text:
            skipped += 1
            continue

        if stdout_mode:
            if target.is_dir():
                print(f"===== {path.relative_to(target)} =====")
            print(new_text)
            if target.is_dir():
                print()
            changed += 1
            continue

        path.write_text(new_text, encoding="utf-8", newline="")
        print(f"EDIT  {path}")
        changed += 1

    if not stdout_mode:
        print()
        print(f"Done. Changed: {changed}, Skipped: {skipped}")

if __name__ == "__main__":
    main()
