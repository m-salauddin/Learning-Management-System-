import os

file_path = r'c:\Users\HP\VsCode\dokkhoit-project\dokkhoit-frontend\app\(public)\courses\[slug]\CourseDetailClient.tsx'

with open(file_path, 'rb') as f:
    data = f.read()

# Replace the literal sequence \ and n (bytes 92 and 110) with a newline (10)
# Looking at the pattern: }) followed by \n
target = b'})\\n'
replacement = b'})\n'

if target in data:
    new_data = data.replace(target, replacement)
    with open(file_path, 'wb') as f:
        f.write(new_data)
    print("Found and replaced literal \\n")
else:
    print("Literal \\n not found in binary mode")
