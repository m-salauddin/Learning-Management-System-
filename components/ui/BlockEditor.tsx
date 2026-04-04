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
import {
    Bold, Italic, List, ListOrdered, Link as LinkIcon,
    Heading1, Heading2, Heading3, AlignLeft, AlignCenter,
    AlignRight, Quote, Code, Undo, Redo, Plus, Type, Check, X as XIcon,
    ListChecks, CircleCheckBig
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
interface BlockEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;
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
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-white/10 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
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
                className="bg-transparent border-none outline-none text-[11px] text-white px-2 py-1 w-48 placeholder:text-white/20"
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
    error
}: BlockEditorProps) => {
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
            TaskItem.configure({
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
                    "focus:outline-none min-h-[300px] px-8 py-8 text-base text-white/90 leading-snug transition-all",
                    "selection:bg-primary/30",
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
        <div className={cn(
            "group relative rounded-2xl border transition-all duration-300 bg-black/20 backdrop-blur-md overflow-hidden",
            error ? "border-red-500/50 ring-2 ring-red-500/10" : "border-white/10 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10",
            className
        )}>
            {}
            <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-white/5 bg-white/5">
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
                <div className="w-px h-4 bg-white/10 mx-1" />
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
                <div className="w-px h-4 bg-white/10 mx-1" />
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
                    <CircleCheckBig className="w-3.5 h-3.5" />
                </MenuButton>
                <div className="w-px h-4 bg-white/10 mx-1" />
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
                    <div className="flex items-center gap-0.5 p-1 rounded-xl bg-slate-900 border border-white/10 shadow-2xl backdrop-blur-xl">
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
                : "text-white/40 hover:text-white hover:bg-white/5",
            disabled && "opacity-20 cursor-not-allowed"
        )}
    >
        {children}
    </button>
);
