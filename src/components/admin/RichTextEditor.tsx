"use client";

import { useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Minus,
  Eye,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface ToolbarAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: (textarea: HTMLTextAreaElement, value: string, onChange: (v: string) => void) => void;
}

function wrapSelection(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (v: string) => void,
  before: string,
  after: string,
  placeholder: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.substring(start, end) || placeholder;
  const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
  onChange(newValue);
  requestAnimationFrame(() => {
    textarea.focus();
    const cursorStart = start + before.length;
    const cursorEnd = cursorStart + selected.length;
    textarea.setSelectionRange(cursorStart, cursorEnd);
  });
}

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (v: string) => void,
  text: string
) {
  const start = textarea.selectionStart;
  const newValue = value.substring(0, start) + text + value.substring(start);
  onChange(newValue);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start + text.length, start + text.length);
  });
}

function prefixLine(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (v: string) => void,
  prefix: string
) {
  const start = textarea.selectionStart;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
  onChange(newValue);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, start + prefix.length);
  });
}

const toolbarActions: ToolbarAction[] = [
  {
    icon: Bold,
    label: "Bold",
    action: (ta, v, set) => wrapSelection(ta, v, set, "**", "**", "bold text"),
  },
  {
    icon: Italic,
    label: "Italic",
    action: (ta, v, set) => wrapSelection(ta, v, set, "*", "*", "italic text"),
  },
  {
    icon: Heading1,
    label: "Heading 1",
    action: (ta, v, set) => prefixLine(ta, v, set, "# "),
  },
  {
    icon: Heading2,
    label: "Heading 2",
    action: (ta, v, set) => prefixLine(ta, v, set, "## "),
  },
  {
    icon: List,
    label: "Bullet List",
    action: (ta, v, set) => prefixLine(ta, v, set, "- "),
  },
  {
    icon: ListOrdered,
    label: "Numbered List",
    action: (ta, v, set) => prefixLine(ta, v, set, "1. "),
  },
  {
    icon: Quote,
    label: "Quote",
    action: (ta, v, set) => prefixLine(ta, v, set, "> "),
  },
  {
    icon: Link,
    label: "Link",
    action: (ta, v, set) => wrapSelection(ta, v, set, "[", "](url)", "link text"),
  },
  {
    icon: Image,
    label: "Image",
    action: (ta, v, set) => insertAtCursor(ta, v, set, "![alt text](image-url)"),
  },
  {
    icon: Minus,
    label: "Divider",
    action: (ta, v, set) => insertAtCursor(ta, v, set, "\n---\n"),
  },
];

function renderMarkdownPreview(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mb-2 mt-4">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mb-2 mt-4">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-3 mt-4">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-2" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>');
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">$1</blockquote>');
  html = html.replace(/^---$/gm, '<hr class="my-4 border-gray-200" />');
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
  html = html.replace(/\n\n/g, "</p><p class='mb-3'>");
  html = `<p class='mb-3'>${html}</p>`;

  return html;
}

export default function RichTextEditor({ value, onChange, placeholder, rows = 12 }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const showPreviewRef = useRef(false);

  const togglePreview = useCallback(() => {
    showPreviewRef.current = !showPreviewRef.current;
    if (textareaRef.current && previewRef.current) {
      if (showPreviewRef.current) {
        textareaRef.current.style.display = "none";
        previewRef.current.style.display = "block";
        previewRef.current.innerHTML = renderMarkdownPreview(value);
      } else {
        textareaRef.current.style.display = "block";
        previewRef.current.style.display = "none";
      }
    }
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const newValue = value.substring(0, start) + "  " + value.substring(ta.selectionEnd);
        onChange(newValue);
        requestAnimationFrame(() => {
          ta.setSelectionRange(start + 2, start + 2);
        });
      }
    },
    [value, onChange]
  );

  return (
    <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden focus-within:border-[var(--color-burgundy)] focus-within:ring-2 focus-within:ring-[var(--color-burgundy)]/20 transition-all">
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600 flex-wrap">
        {toolbarActions.map((action) => (
          <button
            key={action.label}
            type="button"
            title={action.label}
            onClick={() => {
              if (textareaRef.current) {
                action.action(textareaRef.current, value, onChange);
              }
            }}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <action.icon className="w-4 h-4" />
          </button>
        ))}
        <div className="w-px h-5 bg-gray-300 dark:bg-slate-500 mx-1" />
        <button
          type="button"
          title="Preview"
          onClick={togglePreview}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={rows}
        placeholder={placeholder || "Write your content using Markdown..."}
        className="w-full px-4 py-3 text-sm resize-none outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 font-mono"
      />
      <div
        ref={previewRef}
        className="px-4 py-3 text-sm prose prose-sm max-w-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-200 overflow-auto"
        style={{ display: "none", minHeight: `${rows * 1.5}rem` }}
      />
    </div>
  );
}
