
import fs from 'fs';
const content = fs.readFileSync('components/dashboard/courses/new/StepPresentation.tsx', 'utf8');
let open = 0;
let closed = 0;
const lines = content.split('\n');
lines.forEach((line, i) => {
    const openMatches = line.match(/<div|<motion.div/g);
    const closeMatches = line.match(/<\/div>|<\/motion.div>/g);
    if (openMatches) open += openMatches.length;
    if (closeMatches) closed += closeMatches.length;
    console.log(`${i + 1}: [Open: ${open}, Closed: ${closed}] ${line.trim()}`);
});
console.log(`Final: Open: ${open}, Closed: ${closed}, Diff: ${open - closed}`);
