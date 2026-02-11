import os
import re

file_path = r'c:\Users\HP\VsCode\dokkhoit-project\dokkhoit-frontend\app\(public)\courses\[slug]\CourseDetailClient.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines):
    # Improved regex to handle spaces and other tags that might have 'div' in name
    opens = re.findall(r'<div\b', line)
    closes = re.findall(r'</div\s*>', line)
    
    for _ in opens:
        stack.append(i + 1)
    for _ in closes:
        if stack:
            stack.pop()
        else:
            print(f"Extra closing div at line {i + 1}: {line.strip()}")

print(f"Number of unclosed divs: {len(stack)}")
if stack:
    # Print only the first few to avoid bloat
    print(f"First few unclosed divs opened at lines: {stack[:10]}")
    print(f"Last few unclosed divs opened at lines: {stack[-10:]}")
