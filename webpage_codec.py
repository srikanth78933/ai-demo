#!/usr/bin/env python3
"""Simple offline web page encoder/decoder.

This script converts an HTML file into a compact encoded text form and
restores it back to a readable HTML page.

Usage:
  python webpage_codec.py encode sample_page.html encoded_page.txt
  python webpage_codec.py decode encoded_page.txt restored_page.html
"""

from __future__ import annotations

import argparse
import base64
import gzip
from pathlib import Path


def encode_webpage(input_path: str | Path, output_path: str | Path) -> None:
    """Read a web page and store it as a compact base64+gzip payload."""
    raw = Path(input_path).read_bytes()
    compressed = gzip.compress(raw)
    payload = base64.b64encode(compressed).decode("ascii")
    Path(output_path).write_text(payload, encoding="utf-8")
    print(f"Encoded: {input_path} -> {output_path}")


def decode_webpage(input_path: str | Path, output_path: str | Path) -> None:
    """Restore an encoded web page back to HTML."""
    encoded_text = Path(input_path).read_text(encoding="utf-8")
    try:
        compressed = base64.b64decode(encoded_text, validate=True)
        html_bytes = gzip.decompress(compressed)
    except Exception:
        # Fallback for plain base64 data without gzip.
        html_bytes = base64.b64decode(encoded_text, validate=True)

    Path(output_path).write_bytes(html_bytes)
    print(f"Decoded: {input_path} -> {output_path}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Encode or decode an offline web page.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    encode_parser = subparsers.add_parser("encode", help="Encode a web page into a text payload")
    encode_parser.add_argument("input", help="Path to the source HTML file")
    encode_parser.add_argument("output", help="Path to write the encoded output")

    decode_parser = subparsers.add_parser("decode", help="Decode a payload back into HTML")
    decode_parser.add_argument("input", help="Path to the encoded payload file")
    decode_parser.add_argument("output", help="Path to write the restored HTML file")

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "encode":
        encode_webpage(args.input, args.output)
    elif args.command == "decode":
        decode_webpage(args.input, args.output)


if __name__ == "__main__":
    main()
