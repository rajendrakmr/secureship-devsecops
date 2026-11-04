#!/usr/bin/env python3
"""Summarize a Trivy JSON report by severity."""
import json
import sys
from collections import Counter
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit("Usage: python scripts/security-report.py trivy-report.json")

report_path = Path(sys.argv[1])
with report_path.open(encoding="utf-8") as report_file:
    report = json.load(report_file)

counts = Counter()
for result in report.get("Results", []):
    for vulnerability in result.get("Vulnerabilities") or []:
        counts[vulnerability.get("Severity", "UNKNOWN").upper()] += 1

print("Vulnerability summary")
for severity in ("CRITICAL", "HIGH", "MEDIUM", "LOW", "UNKNOWN"):
    print(f"{severity}: {counts[severity]}")

if counts["CRITICAL"] or counts["HIGH"]:
    raise SystemExit(1)
