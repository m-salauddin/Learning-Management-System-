"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import { Node, mergeAttributes } from '@tiptap/core';
import {
    Bold, Italic, List, ListOrdered, Link as LinkIcon,
    Heading1, Heading2, Heading3, AlignLeft, AlignCenter,
    AlignRight, Quote, Code, Undo, Redo, Plus, Type, Check, X as XIcon,
    ListChecks, CircleCheckBig
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, useEffect, useRef, useState, useId } from 'react';
import debounce from 'lodash.debounce';

// Custom TaskItem that renders NO checkbox input — icon bullet is handled via CSS
const NoCheckboxTaskItem = TaskItem.extend({
    addNodeView() {
        return ({ node, HTMLAttributes, getPos, editor }) => {
            const dom = document.createElement('li');
            dom.setAttribute('data-type', 'taskItem');
            dom.setAttribute('data-checked', node.attrs.checked ? 'true' : 'false');
            Object.entries(HTMLAttributes).forEach(([key, value]) => {
                if (key !== 'data-checked') dom.setAttribute(key, value as string);
            });
            const content = document.createElement('div');
            content.setAttribute('data-task-content', 'true');
            dom.appendChild(content);
            return { dom, contentDOM: content };
        };
    },
});
interface BlockEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;
    color?: 'blue' | 'amber' | 'emerald' | 'violet';
}
const LinkEditor = ({
    initialUrl = '',
    onSave,
    onCancel
}: {
    initialUrl?: string,
    onSave: (url: string) => void,
    onCancel: () => void
}) => {
    const [url, setUrl] = useState(initialUrl);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    return (
        <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onSave(url);
                    if (e.key === 'Escape') onCancel();
                }}
                placeholder="Enter URL (https://...)"
                className="bg-transparent border-none outline-none text-[11px] text-slate-900 dark:text-white px-2 py-1 w-48 placeholder:text-slate-400 dark:placeholder:text-white/20"
            />
            <button
                onClick={() => onSave(url)}
                className="p-1 rounded-md hover:bg-emerald-500/20 text-emerald-500 transition-colors"
            >
                <Check className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={onCancel}
                className="p-1 rounded-md hover:bg-red-500/20 text-red-500 transition-colors"
            >
                <XIcon className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};
export const BlockEditor = ({
    value,
    onChange,
    placeholder = "Start writing your course narrative...",
    className,
    error,
    color = 'blue'
}: BlockEditorProps) => {
    const editorId = useId().replace(/:/g, '-');
    const scopeClass = `be-${editorId}`;
    // Theme mapping
    const themeMap = {
        blue: { primary: '#3b82f6', ring: 'rgba(59, 130, 246, 0.2)' },
        amber: { primary: '#f59e0b', ring: 'rgba(245, 158, 11, 0.2)' },
        emerald: { primary: '#10b981', ring: 'rgba(16, 185, 129, 0.2)' },
        violet: { primary: '#8b5cf6', ring: 'rgba(139, 92, 246, 0.2)' }
    };
    const currentTheme = themeMap[color] || themeMap.blue;

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline decoration-primary/30 underline-offset-4 font-bold',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Typography,
            BubbleMenuExtension,
            TaskList,
            NoCheckboxTaskItem.configure({
                nested: true,
            }),
        ],
        content: value,
        immediatelyRender: false,
        shouldRerenderOnTransaction: true,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            lastSentContent.current = html;
            debouncedOnChange(html);
        },
        onSelectionUpdate: ({ editor }) => {
        },
        editorProps: {
            attributes: {
                class: cn(
                    scopeClass,
                    "focus:outline-none min-h-[300px] px-8 py-8 text-base text-slate-900 dark:text-white/90 leading-snug transition-all",
                    "selection:bg-primary/30 prose dark:prose-invert max-w-none",
                    "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol_li]:my-1.5",
                    "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/50 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:bg-gradient-to-r [&_blockquote]:from-primary/5 [&_blockquote]:to-transparent [&_blockquote]:py-3 [&_blockquote]:rounded-r-xl",
                    "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-bold",
                    "[&_p]:my-3",
                    "[&_h1]:text-2xl [&_h1]:font-black [&_h1]:mt-8 [&_h1]:mb-4",
                    "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3",
                    "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2",
                    "[&_li[data-type='taskItem']>div]:flex-1 [&_li[data-type='taskItem']>div>p]:m-0",
                    className
                ),
            },
        },
    });
    const [showToolbarLinkEditor, setShowToolbarLinkEditor] = useState(false);
    const [showBubbleLinkEditor, setShowBubbleLinkEditor] = useState(false);
    const lastSentContent = useRef(value);
    const debouncedOnChange = useMemo(
        () => debounce((html: string) => {
            onChange(html);
        }, 300),
        [onChange]
    );
    useEffect(() => {
        if (!editor || value === editor.getHTML()) return;
        if (value !== lastSentContent.current) {
            editor.commands.setContent(value);
            lastSentContent.current = value;
        }
    }, [value, editor]);
    useEffect(() => {
        return () => {
            debouncedOnChange.cancel();
        };
    }, [debouncedOnChange]);
    const setLink = useCallback((url: string) => {
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
        setShowToolbarLinkEditor(false);
        setShowBubbleLinkEditor(false);
    }, [editor]);
    if (!editor) return null;
    return (
        <div 
            className={cn(
                "group relative rounded-xl border transition-all duration-300 bg-input-dark backdrop-blur-md overflow-hidden",
                error ? "border-red-500/50 ring-2 ring-red-500/20" : "border-input-dark-border focus-within:border-(--primary)/50 focus-within:ring-2 focus-within:ring-(--primary)/20",
                className
            )}
            style={{ 
                '--primary': currentTheme.primary,
                '--color-primary': currentTheme.primary,
                '--ring': currentTheme.ring,
                '--color-ring': currentTheme.ring
            } as React.CSSProperties}
        >
            {/* Scoped bullet-icon styles — bypasses Tailwind escaping issues with mask-image SVG URLs */}
            <style dangerouslySetInnerHTML={{ __html: `
                .${scopeClass} ul { list-style: none !important; padding-left: 0 !important; margin: 1rem 0 !important; }
                .${scopeClass} ul > li { position: relative !important; padding-left: 2rem !important; margin: 0.5rem 0 !important; list-style: none !important; }
                .${scopeClass} ul > li::before {
                    content: '' !important;
                    position: absolute !important;
                    left: 0 !important;
                    top: 3px !important;
                    width: 1.25rem !important;
                    height: 1.25rem !important;
                    background-color: var(--primary, #3b82f6) !important;
                    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'%2F%3E%3Cpath d='m9 11 3 3L22 4'%2F%3E%3C%2Fsvg%3E") !important;
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'%2F%3E%3Cpath d='m9 11 3 3L22 4'%2F%3E%3C%2Fsvg%3E") !important;
                    mask-size: contain !important;
                    -webkit-mask-size: contain !important;
                    mask-repeat: no-repeat !important;
                    -webkit-mask-repeat: no-repeat !important;
                    mask-mode: alpha !important;
                    -webkit-mask-mode: alpha !important;
                }
                .${scopeClass} ul[data-type='taskList'] { list-style: none !important; padding-left: 0 !important; }
                .${scopeClass} li[data-type='taskItem'] { display: flex !important; align-items: flex-start !important; padding-left: 2rem !important; position: relative !important; margin: 0.5rem 0 !important; }
                .${scopeClass} li[data-type='taskItem'] > div { flex: 1 !important; }
                .${scopeClass} li[data-type='taskItem'] > div > p { margin: 0 !important; }
                .${scopeClass} ol { list-style: decimal !important; padding-left: 1.5rem !important; }
                .${scopeClass} ol > li::before { content: none !important; }
            `}} />
            <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-black/40">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                >
                    <Bold className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                >
                    <Italic className="w-3.5 h-3.5" />
                </MenuButton>
                <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive('heading', { level: 1 })}
                >
                    <Heading1 className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 className="w-3.5 h-3.5" />
                </MenuButton>
                <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                >
                    <List className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                >
                    <ListOrdered className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    active={editor.isActive('taskList')}
                >
                    <ListChecks className="w-3.5 h-3.5" />
                </MenuButton>
                <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                >
                    <Quote className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton onClick={() => setShowToolbarLinkEditor(!showToolbarLinkEditor)} active={editor.isActive('link')}>
                    <LinkIcon className="w-3.5 h-3.5" />
                </MenuButton>
                {showToolbarLinkEditor && (
                    <div className="absolute top-12 left-0 z-50">
                        <LinkEditor
                            initialUrl={editor.getAttributes('link').href}
                            onSave={setLink}
                            onCancel={() => setShowToolbarLinkEditor(false)}
                        />
                    </div>
                )}
                <div className="flex-1" />
                <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                    <Undo className="w-3.5 h-3.5" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                    <Redo className="w-3.5 h-3.5" />
                </MenuButton>
            </div>
            <BubbleMenu editor={editor}>
                {showBubbleLinkEditor ? (
                    <LinkEditor
                        initialUrl={editor.getAttributes('link').href}
                        onSave={setLink}
                        onCancel={() => setShowBubbleLinkEditor(false)}
                    />
                ) : (
                    <div className="flex items-center gap-0.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl">
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            active={editor.isActive('bold')}
                            small
                        >
                            <Bold className="w-3 h-3" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            active={editor.isActive('italic')}
                            small
                        >
                            <Italic className="w-3 h-3" />
                        </MenuButton>
                        <MenuButton onClick={() => setShowBubbleLinkEditor(true)} active={editor.isActive('link')} small>
                            <LinkIcon className="w-3 h-3" />
                        </MenuButton>
                    </div>
                )}
            </BubbleMenu>
            <EditorContent editor={editor} />
        </div>
    );
};
interface MenuButtonProps {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    small?: boolean;
}
const MenuButton = ({ onClick, active, disabled, children, small }: MenuButtonProps) => (
    <button
        type="button"
        onClick={(e) => {
            e.preventDefault();
            onClick();
        }}
        disabled={disabled}
        className={cn(
            "rounded-lg transition-all duration-200 flex items-center justify-center",
            small ? "w-7 h-7" : "w-8 h-8",
            active
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
            disabled && "opacity-20 cursor-not-allowed"
        )}
    >
        {children}
    </button>
);
