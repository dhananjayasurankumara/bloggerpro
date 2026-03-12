"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import React, { useCallback } from "react";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Link as LinkIcon, 
  Type, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Image as ImageIcon,
  Unlink,
  Palette
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children,
  title
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg transition-all ${
      isActive 
        ? "bg-primary text-white shadow-lg active:scale-90" 
        : "text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-primary active:scale-95"
    } disabled:opacity-30`}
  >
    {children}
  </button>
);

export default function RichTextEditor({ content, onChange, placeholder = "Start writing your article..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TextStyle,
      Color,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full h-auto my-8 shadow-2xl',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="w-full border border-gray-100 dark:border-zinc-800 rounded-[40px] overflow-hidden bg-white dark:bg-black shadow-sm group focus-within:border-primary/30 transition-all">
      {/* Premium Toolbar */}
      <div className="sticky top-0 z-10 px-4 py-3 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 flex flex-wrap gap-1 items-center">
        <div className="flex items-center gap-1 pr-4 border-r border-gray-100 dark:border-zinc-900">
            <MenuButton 
                onClick={() => editor.chain().focus().toggleBold().run()} 
                isActive={editor.isActive("bold")}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
                onClick={() => editor.chain().focus().toggleItalic().run()} 
                isActive={editor.isActive("italic")}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
                onClick={() => editor.chain().focus().toggleUnderline().run()} 
                isActive={editor.isActive("underline")}
                title="Underline"
            >
                <UnderlineIcon className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
                onClick={() => editor.chain().focus().toggleStrike().run()} 
                isActive={editor.isActive("strike")}
                title="Strikethrough"
            >
                <Strikethrough className="w-4 h-4" />
            </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-4 border-r border-gray-100 dark:border-zinc-900">
            <MenuButton 
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
                isActive={editor.isActive("heading", { level: 2 })}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
                isActive={editor.isActive("heading", { level: 3 })}
                title="Heading 3"
            >
                <Heading3 className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
                onClick={() => editor.chain().focus().setParagraph().run()} 
                isActive={editor.isActive("paragraph")}
                title="Paragraph"
            >
                <Type className="w-4 h-4" />
            </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-4 border-r border-gray-100 dark:border-zinc-900">
            <MenuButton 
                onClick={() => editor.chain().focus().toggleBulletList().run()} 
                isActive={editor.isActive("bulletList")}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
                onClick={() => editor.chain().focus().toggleOrderedList().run()} 
                isActive={editor.isActive("orderedList")}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
                onClick={() => editor.chain().focus().toggleBlockquote().run()} 
                isActive={editor.isActive("blockquote")}
                title="Blockquote"
            >
                <Quote className="w-4 h-4" />
            </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-4 border-r border-gray-100 dark:border-zinc-900">
            <MenuButton 
                onClick={setLink} 
                isActive={editor.isActive("link")}
                title="Add Link"
            >
                <LinkIcon className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
                onClick={() => editor.chain().focus().unsetLink().run()} 
                disabled={!editor.isActive("link")}
                title="Remove Link"
            >
                <Unlink className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
                onClick={addImage} 
                title="Insert Image URL"
            >
                <ImageIcon className="w-4 h-4" />
            </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-4">
            <MenuButton 
                onClick={() => editor.chain().focus().undo().run()} 
                disabled={!editor.can().undo()}
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
                onClick={() => editor.chain().focus().redo().run()} 
                disabled={!editor.can().redo()}
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </MenuButton>
        </div>

        <div className="ml-auto flex items-center gap-2 pr-2">
            <input 
                type="color" 
                onInput={e => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
                className="w-8 h-8 rounded-full border-none cursor-pointer bg-transparent"
                title="Text Color"
            />
            <Palette className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="min-h-[500px] p-8 md:p-12 prose prose-lg dark:prose-invert prose-primary max-w-none prose-p:leading-relaxed prose-headings:font-display prose-headings:font-bold prose-p:text-gray-600 dark:prose-p:text-gray-400">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
