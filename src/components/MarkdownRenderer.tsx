import React, { useState } from 'react';
import { Copy, Check, Table as TableIcon } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // If no content, render empty
  if (!content) return null;

  // Split content into code blocks and normal text blocks
  // Regex matches ```lang\ncode```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose max-w-full text-slate-700 font-sans">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // It's a code block
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const language = match ? match[1] : '';
          const code = match ? match[2] : part.slice(3, -3);
          return <CodeBlock key={index} code={code.trim()} language={language} />;
        } else {
          // It's normal text
          return <TextBlock key={index} text={part} />;
        }
      })}
    </div>
  );
};

// Sub-component for interactive code blocks with copy support
interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const displayLang = language ? language.toUpperCase() : 'CODE';

  return (
    <div className="my-5 rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-slate-950 text-slate-200 font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-sans select-none">
        <span className="font-medium tracking-wider text-sky-400">{displayLang}</span>
        <button
          onClick={handleCopy}
          id={`copy-btn-${Math.random().toString(36).substr(2, 9)}`}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors py-1 px-2 rounded-md hover:bg-slate-800/80 active:scale-95 duration-100"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto leading-relaxed">
        <pre className="m-0 p-0 bg-transparent border-0 shadow-none"><code className="text-xs md:text-sm text-slate-100">{code}</code></pre>
      </div>
    </div>
  );
};

// Sub-component for structured text blocks
interface TextBlockProps {
  text: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ text }) => {
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentListItems: { text: string; type: 'ul' | 'ol' }[] = [];
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushList = (key: string) => {
    if (currentListItems.length === 0) return null;
    const type = currentListItems[0].type;
    const items = [...currentListItems];
    currentListItems = [];

    if (type === 'ul') {
      return (
        <ul key={key} className="list-disc pl-5 my-3 space-y-1 text-slate-700">
          {items.map((item, idx) => (
            <li key={idx}>{parseInlineFormatting(item.text)}</li>
          ))}
        </ul>
      );
    } else {
      return (
        <ol key={key} className="list-decimal pl-5 my-3 space-y-1 text-slate-700">
          {items.map((item, idx) => (
            <li key={idx}>{parseInlineFormatting(item.text)}</li>
          ))}
        </ol>
      );
    }
  };

  const flushTable = (key: string) => {
    if (!inTable) return null;
    inTable = false;
    const headers = [...tableHeaders];
    const rows = [...tableRows];
    tableHeaders = [];
    tableRows = [];

    return (
      <div key={key} className="my-4 overflow-x-auto rounded-xl border border-slate-200 bg-white/50 shadow-sm max-w-full">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-sky-50/50 border-b border-slate-200">
              {headers.map((h, idx) => (
                <th key={idx} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 border-r border-slate-100 last:border-0">
                  <div className="flex items-center gap-1.5">
                    {idx === 0 && <TableIcon className="w-3 h-3 text-sky-500" />}
                    {parseInlineFormatting(h)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-sky-50/10 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2.5 text-sm text-slate-600 border-r border-slate-100 last:border-0">
                    {parseInlineFormatting(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 1. Detect Tables (starts or contains |)
    if (line.startsWith('|') && line.endsWith('|')) {
      // Flush any prior list
      if (currentListItems.length > 0) {
        renderedElements.push(flushList(`list-before-table-${i}`));
      }

      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      // Check if it's a separator line like |---|---|
      const isSeparator = cells.every(c => c.startsWith('-') || c === '');
      
      if (isSeparator) {
        // Just skip separator lines, table format is set
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      // Table is finished, flush it
      renderedElements.push(flushTable(`table-end-${i}`));
    }

    // 2. Detect Lists
    const ulMatch = line.match(/^[\-\*]\s+(.*)$/);
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);

    if (ulMatch) {
      currentListItems.push({ text: ulMatch[1], type: 'ul' });
      continue;
    } else if (olMatch) {
      currentListItems.push({ text: olMatch[2], type: 'ol' });
      continue;
    } else {
      // Not a list line, so flush any list we have accumulated
      if (currentListItems.length > 0) {
        renderedElements.push(flushList(`list-end-${i}`));
      }
    }

    // 3. Headings
    if (line.startsWith('### ')) {
      renderedElements.push(
        <h3 key={i} className="text-base md:text-lg font-semibold font-display text-slate-800 mt-4 mb-2 tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-4 bg-sky-400 rounded-full"></span>
          {parseInlineFormatting(line.slice(4))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      renderedElements.push(
        <h2 key={i} className="text-lg md:text-xl font-semibold font-display text-slate-900 mt-5 mb-2.5 tracking-tight border-b border-sky-100/40 pb-1 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-sky-500 rounded-full"></span>
          {parseInlineFormatting(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith('# ')) {
      renderedElements.push(
        <h1 key={i} className="text-xl md:text-2xl font-bold font-display text-slate-900 mt-6 mb-3 tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-sky-600 rounded-full"></span>
          {parseInlineFormatting(line.slice(2))}
        </h1>
      );
      continue;
    }

    // 4. Blockquotes
    if (line.startsWith('> ')) {
      renderedElements.push(
        <blockquote key={i} className="border-l-4 border-sky-400 bg-sky-50/30 px-4 py-2.5 rounded-r-xl my-3 text-slate-600 italic">
          {parseInlineFormatting(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // 5. Horizontal Rules
    if (line === '---' || line === '***' || line === '___') {
      renderedElements.push(<hr key={i} className="my-6 border-slate-200/85" />);
      continue;
    }

    // 6. Regular paragraphs
    if (line !== '') {
      renderedElements.push(
        <p key={i} className="mb-3 text-sm md:text-base text-slate-700 leading-relaxed">
          {parseInlineFormatting(line)}
        </p>
      );
    }
  }

  // Final flushes if we hit end of text block
  if (currentListItems.length > 0) {
    renderedElements.push(flushList(`list-final`));
  }
  if (inTable) {
    renderedElements.push(flushTable(`table-final`));
  }

  return <>{renderedElements}</>;
};

// Helper function to parse inline markdown (images, bold, italic, inline code)
function parseInlineFormatting(text: string): React.ReactNode[] {
  if (!text) return [];

  // Parse images (![alt](url)), bold (**text**), italic (*text*), inline code (`code`)
  const regex = /(!\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('![') && part.includes('](') && part.endsWith(')')) {
      const altMatch = part.match(/!\[(.*?)\]/);
      const urlMatch = part.match(/\((.*?)\)/);
      const alt = altMatch ? altMatch[1] : '';
      const url = urlMatch ? urlMatch[1] : '';
      return (
        <img key={index} src={url} alt={alt} className="max-w-full h-auto rounded-xl shadow-md border border-slate-100 my-4" />
      );
    } else if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    } else if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="font-mono text-xs bg-sky-50 border border-sky-100/50 text-sky-700 px-1.5 py-0.5 rounded font-medium">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
