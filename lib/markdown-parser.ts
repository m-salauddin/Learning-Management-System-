
export const applyInline = (text: string): string => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(/~~(.*?)~~/g, '<del class="opacity-50 line-through">$1</del>')
        .replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800/80 text-violet-500 dark:text-violet-400 px-1.5 py-0.5 rounded text-[10px] font-mono">$1</code>')
        .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-violet-500 underline underline-offset-2 hover:text-violet-400">$1</a>');
};

export const parseMarkdown = (text: string) => {
    if (!text) return "";

    
    const codeBlocks: string[] = [];
    let html = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
        const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;").trimEnd();
        const langLabel = lang ? `<span class="text-[9px] font-black uppercase tracking-widest text-slate-400 select-none">${lang}</span>` : '';
        codeBlocks.push(
            `<div class="my-3 rounded-lg overflow-hidden border border-slate-300 dark:border-white/10">` +
                (lang ? `<div class="flex items-center justify-between px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-white/10">${langLabel}</div>` : '') +
                `<pre class="p-3 bg-slate-50 dark:bg-slate-900 overflow-x-auto custom-scrollbar"><code class="text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre">${escaped}</code></pre>` +
            `</div>`
        );
        return `%%CODE_BLOCK_${codeBlocks.length - 1}%%`;
    });

    
    html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    
    const lines = html.split('\n');
    const outputLines: string[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        
        if (/^\|.+\|/.test(line) && lines[i + 1] && /^\|[\s|:-]+\|/.test(lines[i + 1])) {
            const headers = line.split('|').map(h => h.trim()).filter(Boolean);
            const aligns = lines[i + 1].split('|').map(a => a.trim()).filter(Boolean).map(a =>
                a.startsWith(':') && a.endsWith(':') ? 'text-center' :
                a.endsWith(':') ? 'text-right' : 'text-left'
            );
            i += 2; 
            const bodyRows: string[] = [];
            while (i < lines.length && /^\|.+\|/.test(lines[i])) {
                const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
                bodyRows.push(
                    `<tr class="border-b border-slate-100 dark:border-white/5 last:border-0">` +
                    cells.map((c, ci) => `<td class="px-3 py-2 text-slate-700 dark:text-slate-300 ${aligns[ci] || 'text-left'}">${applyInline(c)}</td>`).join('') +
                    `</tr>`
                );
                i++;
            }
            outputLines.push(
                `<div class="my-3 overflow-hidden rounded-lg border border-slate-300 dark:border-white/10">` +
                `<table class="w-full text-[11px] border-collapse bg-white dark:bg-slate-950/20">` +
                `<thead class="bg-slate-100 dark:bg-slate-800">` +
                `<tr>${headers.map((h, hi) => `<th class="px-3 py-2 font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider ${aligns[hi] || 'text-left'}">${applyInline(h)}</th>`).join('')}</tr>` +
                `</thead><tbody>${bodyRows.join('')}</tbody></table></div>`
            );
            continue;
        }

        
        const h3 = line.match(/^### (.+)$/);
        const h2 = line.match(/^## (.+)$/);
        const h1 = line.match(/^# (.+)$/);
        if (h1) { outputLines.push(`<h1 class="text-sm font-black text-slate-900 dark:text-white mt-4 mb-1.5 pb-1 border-b border-slate-300 dark:border-white/10">${applyInline(h1[1])}</h1>`); i++; continue; }
        if (h2) { outputLines.push(`<h2 class="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1">${applyInline(h2[1])}</h2>`); i++; continue; }
        if (h3) { outputLines.push(`<h3 class="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-2.5 mb-1">${applyInline(h3[1])}</h3>`); i++; continue; }

        
        if (/^---+$/.test(line.trim())) { outputLines.push(`<hr class="my-4 border-slate-300 dark:border-white/10"/>`); i++; continue; }

        
        if (/^&gt;\s?/.test(line)) {
            const bqLines: string[] = [];
            while (i < lines.length && /^&gt;\s?/.test(lines[i])) {
                bqLines.push(lines[i].replace(/^&gt;\s?/, ''));
                i++;
            }
            outputLines.push(
                `<blockquote class="my-2 pl-3 border-l-2 border-violet-400 text-slate-500 dark:text-slate-400 italic">` +
                bqLines.map(l => applyInline(l)).join('<br/>') +
                `</blockquote>`
            );
            continue;
        }

        
        const olMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
        if (olMatch) {
            const listItems: string[] = [];
            while (i < lines.length) {
                const m = lines[i].match(/^(\s*)(\d+)\.\s+(.+)$/);
                if (!m) break;
                const indentCls = m[1].length >= 4 ? ' ml-6' : m[1].length >= 2 ? ' ml-3' : '';
                listItems.push(`<div class="flex gap-2 leading-snug${indentCls}"><span class="shrink-0 font-mono text-slate-400 dark:text-slate-500 w-[18px] text-right">${m[2]}.</span><span>${applyInline(m[3])}</span></div>`);
                i++;
            }
            outputLines.push(`<div class="my-1.5 space-y-0.5 text-[11px]">${listItems.join('')}</div>`);
            continue;
        }

        
        const ulMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
        if (ulMatch) {
            const listItems: string[] = [];
            while (i < lines.length) {
                const m = lines[i].match(/^(\s*)[-*+]\s+(.+)$/);
                if (!m) break;
                const indentCls = m[1].length >= 4 ? ' ml-6' : m[1].length >= 2 ? ' ml-3' : '';
                listItems.push(`<div class="flex gap-2 leading-snug${indentCls}"><span class="shrink-0 text-slate-400 dark:text-slate-500 mt-px">•</span><span>${applyInline(m[2])}</span></div>`);
                i++;
            }
            outputLines.push(`<div class="my-1.5 space-y-0.5 text-[11px]">${listItems.join('')}</div>`);
            continue;
        }

        
        if (line.trim() === '') { outputLines.push('__BREAK__'); i++; continue; }

        
        outputLines.push(applyInline(line));
        i++;
    }

    
    const paragraphs: string[] = [];
    let current: string[] = [];
    for (const l of outputLines) {
        if (l === '__BREAK__') {
            if (current.length) { paragraphs.push(current.join('<br/>')); current = []; }
        } else if (l.startsWith('<h') || l.startsWith('<hr') || l.startsWith('<blockquote') || l.startsWith('<div') || l.startsWith('<table') || l.startsWith('%%CODE')) {
            if (current.length) { paragraphs.push(`<p class="mb-2 leading-relaxed">${current.join('<br/>')}</p>`); current = []; }
            paragraphs.push(l);
        } else {
            current.push(l);
        }
    }
    if (current.length) paragraphs.push(`<p class="mb-2 leading-relaxed">${current.join('<br/>')}</p>`);

    let result = paragraphs.join('');

    
    result = result.replace(/%%CODE_BLOCK_(\d+)%%/g, (_, n) => codeBlocks[+n]);

    return result;
};
