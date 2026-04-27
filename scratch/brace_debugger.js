
const fs = require('fs');
const content = fs.readFileSync('components/dashboard/courses/new/StepPresentation.tsx', 'utf8');
const stacks = {
    '(': [],
    '{': [],
    '[': []
};
const matching = {
    ')': '(',
    '}': '{',
    ']': '['
};

const lines = content.split('\n');
lines.forEach((line, i) => {
    for (let char of line) {
        if ('({['.includes(char)) {
            stacks[char].push(i + 1);
        } else if (')}]'.includes(char)) {
            const match = matching[char];
            if (stacks[match].length > 0) {
                stacks[match].pop();
            } else {
                console.log(`Unmatched ${char} on line ${i + 1}`);
            }
        }
    }
});

for (let key in stacks) {
    if (stacks[key].length > 0) {
        console.log(`Unclosed ${key} from lines: ${stacks[key].join(', ')}`);
    }
}
