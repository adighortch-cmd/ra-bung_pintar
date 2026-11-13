import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Copy, Check, AlertTriangle, Info, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Normalizes \[...\] and \(...\) LaTeX delimiters to $$...$$ and $...$ outside fenced/inline code blocks
 * so both standard Markdown math and Gemini LaTeX syntax render consistently via remark-math + rehype-katex.
 */
export function normalizeLatexDelimiters(markdown: string): string {
  if (!markdown) return '';
  // Split by fenced code blocks or inline code so we never alter shell/code snippets
  const segments = markdown.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
  return segments
    .map((segment) => {
      if (segment.startsWith('```') || segment.startsWith('`')) {
        return segment;
      }
      return segment
        .replace(/\\\[([\s\S]*?)\\\]/g, (_match, expr) => `\n$$\n${expr.trim()}\n$$\n`)
        .replace(/\\\(([\s\S]*?)\\\)/g, (_match, expr) => `$${expr.trim()}$`);
    })
    .join('');
}

function extractTextContent(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node) && node.props?.children) {
    return extractTextContent(node.props.children);
  }
  return '';
}

const CodeBlockCard: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="my-2.5 rounded-xl overflow-hidden border border-slate-700/80 bg-[#070b13] shadow-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/95 border-b border-slate-800 text-[11px] font-mono text-slate-400">
        <span className="inline-flex items-center gap-1.5 uppercase tracking-wider text-emerald-400 font-semibold">
          <Terminal className="w-3 h-3" />
          <span>{language || 'terminal'}</span>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Salin Kode</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto font-mono text-xs text-emerald-300 leading-relaxed m-0">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const normalizedContent = normalizeLatexDelimiters(content);

  return (
    <div className={`rpm-markdown text-xs sm:text-sm leading-relaxed text-slate-200 space-y-2 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={{
          pre({ children }) {
            // Render fenced code block via CodeBlockCard
            const childArray = React.Children.toArray(children);
            const firstChild = childArray[0];
            if (React.isValidElement<{ className?: string; children?: React.ReactNode }>(firstChild)) {
              const classNameProp = firstChild.props.className || '';
              const langMatch = /language-([\w-]+)/.exec(classNameProp);
              const lang = langMatch ? langMatch[1] : 'terminal';
              const rawCode = extractTextContent(firstChild.props.children).replace(/\n$/, '');
              return <CodeBlockCard language={lang} code={rawCode} />;
            }
            return (
              <pre className="p-3 rounded-xl bg-[#070b13] border border-slate-700/80 overflow-x-auto font-mono text-xs text-emerald-300">
                {children}
              </pre>
            );
          },
          code({ className: codeClass, children, ...props }) {
            // Fenced blocks are wrapped inside <pre>; inline code reaches here directly
            const isBlock = typeof codeClass === 'string' && codeClass.includes('language-');
            if (isBlock) {
              return (
                <code className={codeClass} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800/90 border border-slate-700/80 text-emerald-300 font-mono text-[11px] sm:text-xs"
                {...props}
              >
                {children}
              </code>
            );
          },
          p({ children }) {
            const plain = extractTextContent(children).trim();
            const isPedagogicalHeader =
              /^[1-6]\.\s+(SAPAAN|PENJELASAN|CONTOH|JAWABAN|HAFALAN|PERTANYAAN)/i.test(plain) ||
              /^[1-4]\.\s+(AKAR PENYEBAB|LANGKAH PEMERIKSAAN|LANGKAH ANALISIS|SOLUSI PERBAIKAN|CARA VERIFIKASI)/i.test(
                plain
              );

            if (isPedagogicalHeader) {
              return (
                <div className="pt-2 pb-1 font-display font-bold text-emerald-300 text-xs sm:text-sm border-b border-emerald-500/20">
                  {children}
                </div>
              );
            }

            return <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{children}</p>;
          },
          h1({ children }) {
            return (
              <h1 className="font-display font-bold text-base sm:text-lg text-emerald-300 pt-2 pb-1 border-b border-emerald-500/20">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="font-display font-bold text-sm sm:text-base text-emerald-300 pt-1.5 pb-0.5 border-b border-emerald-500/20">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="font-display font-semibold text-xs sm:text-sm text-cyan-300 pt-1">
                {children}
              </h3>
            );
          },
          strong({ children }) {
            return <strong className="font-semibold text-white">{children}</strong>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 space-y-1 text-slate-200">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 space-y-1 text-slate-200">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          blockquote({ children }) {
            const text = extractTextContent(children);
            const isWarning = /peringatan|keamanan|bahaya|hindari/i.test(text);
            return (
              <blockquote
                className={`my-2 flex items-start gap-2.5 p-3 rounded-xl border text-xs ${
                  isWarning
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200'
                }`}
              >
                {isWarning ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 flex-1 min-w-0">{children}</div>
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="my-2.5 overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-950/60">
                <table className="w-full text-left border-collapse text-xs">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-slate-900 text-emerald-300 font-mono uppercase text-[11px]">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-3 py-2 border-b border-slate-700/80 font-semibold">{children}</th>;
          },
          td({ children }) {
            return <td className="px-3 py-2 border-b border-slate-800/80 text-slate-300">{children}</td>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                {children}
              </a>
            );
          },
          hr() {
            return <hr className="border-slate-800 my-2" />;
          },
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
};
