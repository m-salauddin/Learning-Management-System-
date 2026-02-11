import sys
import os

file_path = r'c:\Users\HP\VsCode\dokkhoit-project\dokkhoit-frontend\app\(public)\courses\[slug]\CourseDetailClient.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix the benefits map (lines 1515 to 1528, which are indices 1514 to 1528)
new_benefits_block = """                                            {[
                                                { icon: Infinity, label: 'Lifetime Access' },
                                                { icon: ShieldCheck, label: 'Money Back' },
                                                { icon: Award, label: 'Certificate' },
                                                { icon: Headphones, label: '24/7 Support' }
                                            ].map((benefit, i) => {
                                                const Icon = benefit.icon;
                                                return (
                                                    <div key={i} className="flex items-center gap-2 text-slate-400">
                                                        <Icon className="w-4 h-4 text-primary/60" />
                                                        <span className="text-xs font-bold leading-none">{benefit.label}</span>
                                                    </div>
                                                );
                                            })}"""

# Lines 1515-1528 (indices 1514 to 1527 inclusive, so range(1514, 1528))
lines[1514:1528] = [line + '\\n' for line in new_benefits_block.split('\\n')]

# Now find the extra </div> at the end. 
# It was at line 1858, but after the replacement above (which changed 14 lines to 13 lines), 
# it should be at index 1856 (line 1857).
# Let's search for it to be sure.
extra_div_found = False
for i in range(len(lines) - 1, len(lines) - 20, -1):
    if '</div >' in lines[i] and ');' in lines[i+1]:
        lines.pop(i)
        extra_div_found = True
        print(f"Removed extra div at index {i}")
        break

if not extra_div_found:
    print("Could not find the extra </div > near the end")

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Successfully updated benefits map!")
