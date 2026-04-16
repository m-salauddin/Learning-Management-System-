import re
import sys

def remove_comments(text):
    def replacer(match):
        s = match.group(0)
        if s.startswith('/'):
            return " " # replacement for comments
        else:
            return s
    
    # regex to match strings and comments
    pattern = re.compile(
        r'//.*?$|/\*.*?\*/|\'(?:\\.|[^\\\'])*\'|"(?:\\.|[^\\"])*"',
        re.DOTALL | re.MULTILINE
    )
    return re.sub(pattern, replacer, text)

if __name__ == "__main__":
    file_path = r'c:\Users\HP\VsCode\Web Projects\dokkhoit-project\dokkhoit-frontend\app\(protected)\dashboard\my-courses\[slug]\[lessonId]\ClientComponent.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    clean_content = remove_comments(content)
    
    # Remove excessive blank lines if any
    # clean_content = re.sub(r'\n\s*\n', '\n\n', clean_content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(clean_content)
    print("Comments removed successfully.")
