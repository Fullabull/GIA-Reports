#!/usr/bin/env bash
# gdg.sh
# Dumps every git version of a file, 7-char SHA appended to the filename.
# Run from the repo root. Path must be relative to repo root.
#
# Usage: gdg.sh <repo-relative-path> [output_dir]
#
# Example:
#   gdg.sh docs/web/GIA-Operations-Report_20260630.html ./gdg_out
#
# Produces (newest to oldest):
#   GIA-Operations-Report_20260630_abc1234.html
#   GIA-Operations-Report_20260630_def5678.html
#   GIA-Operations-Report_20260630_9ab0123.html

set -e

file="$1"
outdir="${2:-.}"

if [[ -z "$file" ]]; then
    echo "Usage: gdg.sh <repo-relative-path> [output_dir]"
    exit 1
fi

mkdir -p "$outdir"

# Split basename into name + extension
base=$(basename "$file")
if [[ "$base" == *.* ]]; then
    name="${base%.*}"
    ext=".${base##*.}"
else
    name="$base"
    ext=""
fi

echo ""
echo "=== gdg: $file ==="
echo "Output: $outdir"
echo ""

count=0
while IFS= read -r line; do
    sha="${line:0:7}"
    outfile="${outdir}/${name}_${sha}${ext}"
    git show "${sha}:${file}" > "$outfile"
    echo "  $sha  ->  $(basename "$outfile")"
    count=$((count + 1))
done < <(git log --follow --abbrev=7 --oneline -- "$file")

echo ""
echo "$count version(s) written to $outdir"
