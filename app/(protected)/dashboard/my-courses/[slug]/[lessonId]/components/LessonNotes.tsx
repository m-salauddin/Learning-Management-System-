"use client";
import { useState, useEffect } from "react";
import {
    Edit3, Bold, Italic, Underline, List, ListOrdered, Code, Quote,
    Undo, Redo, Heading1, Heading2, Highlighter, CheckSquare, Play,
    ShieldAlert, ShieldCheck, Terminal, Fingerprint, Lock
} from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TiptapLink from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LessonNotesProps { lessonId: string; }

export function LessonNotes({ lessonId }: LessonNotesProps) {
    const [tab, setTab] = useState<'notes' | 'security'>('notes');
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Placeholder.configure({ placeholder: 'Start taking notes... Use "/" for commands' }),
            Highlight.configure({ multicolor: true }),
            TiptapLink.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline cursor-pointer' } }),
            TaskList, TaskItem.configure({ nested: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Typography, Image.configure({ allowBase64: true }),
        ],
        content: typeof window !== 'undefined' ? localStorage.getItem(`notes-${lessonId}`) || '' : '',
        onUpdate: ({ editor }) => {
            if (typeof window !== 'undefined') localStorage.setItem(`notes-${lessonId}`, editor.getHTML());
        },
        editorProps: { attributes: { class: 'focus:outline-none max-w-none min-h-[350px]' } },
    });

    useEffect(() => {
        if (editor && lessonId) {
            const saved = typeof window !== 'undefined' ? localStorage.getItem(`notes-${lessonId}`) || '' : '';
            editor.commands.setContent(saved);
        }
    }, [lessonId, editor]);

    return (
        <div className="space-y-4">
            {/* Tab switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/2 border border-slate-200/60 dark:border-white/6 rounded-xl w-fit">
                {[
                    { id: 'notes' as const, icon: Edit3, label: 'Notes' },
                    { id: 'security' as const, icon: Lock, label: 'Security' }
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={cn("px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-2 relative z-10",
                            tab === t.id ? "text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-white")}>
                        {tab === t.id && <motion.div layoutId="notesTab" className={cn("absolute inset-0 rounded-lg shadow-sm", t.id === 'security' ? "bg-red-500" : "bg-primary")} transition={{ type: "spring", bounce: 0.1, duration: 0.4 }} />}
                        <t.icon className="w-3 h-3 relative z-10" />
                        <span className="relative z-10">{t.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-[#060a14] border border-slate-200/80 dark:border-white/6 rounded-2xl overflow-hidden shadow-sm">
                <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}>
                        {tab === 'notes' ? (
                            <div>
                                {/* Toolbar */}
                                <div className="px-4 py-2 border-b border-slate-200/60 dark:border-white/4 bg-slate-50 dark:bg-white/2 flex items-center justify-between">
                                    <div className="flex items-center gap-0.5">
                                        {[
                                            { action: () => editor?.chain().focus().toggleBold().run(), check: 'bold', Icon: Bold },
                                            { action: () => editor?.chain().focus().toggleItalic().run(), check: 'italic', Icon: Italic },
                                            { action: () => editor?.chain().focus().toggleStrike().run(), check: 'strike', Icon: Underline },
                                        ].map((btn, i) => (
                                            <button key={i} onClick={btn.action} className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-white/5 transition-colors", editor?.isActive(btn.check) && "text-primary bg-primary/10")}>
                                                <btn.Icon className="w-3 h-3" />
                                            </button>
                                        ))}
                                        <div className="w-px h-3 bg-slate-200 dark:bg-white/10 mx-1" />
                                        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-white/5", editor?.isActive('bulletList') && "text-primary bg-primary/10")}><List className="w-3 h-3" /></button>
                                        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-white/5", editor?.isActive('orderedList') && "text-primary bg-primary/10")}><ListOrdered className="w-3 h-3" /></button>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        <button onClick={() => editor?.chain().focus().undo().run()} className="p-2 hover:text-primary transition-colors text-slate-400"><Undo className="w-3 h-3" /></button>
                                        <button onClick={() => editor?.chain().focus().redo().run()} className="p-2 hover:text-primary transition-colors text-slate-400"><Redo className="w-3 h-3" /></button>
                                    </div>
                                </div>
                                {/* Editor */}
                                <div className="relative tiptap-editor" suppressHydrationWarning>
                                    {mounted && editor && (
                                        <>
                                            <BubbleMenu editor={editor} className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg shadow-xl">
                                                <button onClick={() => editor.chain().focus().toggleBold().run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5", editor.isActive('bold') && "text-primary")}><Bold className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5", editor.isActive('italic') && "text-primary")}><Italic className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5", editor.isActive('highlight') && "text-yellow-400")}><Highlighter className="w-3.5 h-3.5" /></button>
                                                <div className="w-px h-3 bg-slate-200 dark:bg-white/10 mx-0.5" />
                                                <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5", editor.isActive('heading', { level: 1 }) && "text-primary")}><Heading1 className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5", editor.isActive('heading', { level: 2 }) && "text-primary")}><Heading2 className="w-3.5 h-3.5" /></button>
                                            </BubbleMenu>
                                            <FloatingMenu editor={editor} className="flex flex-col gap-0.5 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl min-w-[140px]">
                                                <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase"><Heading1 className="w-3.5 h-3.5 text-primary" /> Heading 1</button>
                                                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase"><Heading2 className="w-3.5 h-3.5 text-primary" /> Heading 2</button>
                                                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase"><List className="w-3.5 h-3.5 text-primary" /> Bullet List</button>
                                                <button onClick={() => editor.chain().focus().toggleTaskList().run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase"><CheckSquare className="w-3.5 h-3.5 text-primary" /> Task List</button>
                                                <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase"><Code className="w-3.5 h-3.5 text-primary" /> Code Block</button>
                                                <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase"><Quote className="w-3.5 h-3.5 text-primary" /> Quote</button>
                                            </FloatingMenu>
                                            <div className="px-6 py-4"><EditorContent editor={editor} /></div>
                                        </>
                                    )}
                                </div>
                                <div className="px-4 py-2 bg-slate-50 dark:bg-white/2 border-t border-slate-200/60 dark:border-white/4 flex items-center justify-between">
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Auto-saved</span></div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 space-y-8">
                                <div className="flex items-center gap-3 pb-5 border-b border-red-200/60 dark:border-red-500/20">
                                    <ShieldAlert className="w-5 h-5 text-red-500" />
                                    <div><h3 className="text-lg font-bold text-slate-900 dark:text-white">Security Notice</h3><p className="text-[10px] text-red-500/80 font-semibold uppercase tracking-wider">Content Protection Active</p></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-slate-500"><ShieldCheck className="w-3.5 h-3.5" /><span className="text-[9px] font-bold uppercase tracking-wider">Protection</span></div>
                                        {[
                                            { n: "01", title: "Watermarked Content", desc: "All content is uniquely watermarked for tracking." },
                                            { n: "02", title: "Session Protection", desc: "Sharing credentials triggers access revocation." },
                                            { n: "03", title: "Content Integrity", desc: "Extraction attempts result in account action." }
                                        ].map((p, i) => (
                                            <div key={i} className="flex gap-3 group"><span className="text-[10px] font-bold text-red-300 group-hover:text-red-500">{p.n}</span><div><p className="text-[11px] font-bold text-slate-800 dark:text-white">{p.title}</p><p className="text-[10px] text-slate-500">{p.desc}</p></div></div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-slate-500"><Terminal className="w-3.5 h-3.5" /><span className="text-[9px] font-bold uppercase tracking-wider">Violations</span></div>
                                        {[
                                            { term: "Content Sharing", penalty: "Account Suspension" },
                                            { term: "Credential Fraud", penalty: "Permanent Ban" },
                                            { term: "Content Theft", penalty: "Legal Action" }
                                        ].map((t, i) => (
                                            <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/60 dark:border-white/6 hover:border-red-200 dark:hover:border-red-500/20 transition-all flex items-center justify-between">
                                                <span className="text-[10px] font-medium text-slate-500">{t.term}</span>
                                                <span className="text-[10px] font-bold text-red-500">{t.penalty}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
