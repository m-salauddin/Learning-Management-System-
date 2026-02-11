import os

file_path = r'c:\Users\HP\VsCode\dokkhoit-project\dokkhoit-frontend\app\(public)\courses\[slug]\CourseDetailClient.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line 1528 is index 1527
target_line = lines[1527]
if '\\n' in target_line:
    lines[1527] = target_line.replace('\\n', '\n')
    print(f"Replaced literal \\n in line 1528")

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
