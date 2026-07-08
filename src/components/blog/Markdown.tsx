import type { ReactNode } from "react";

/**
 * Minimal, dependency-free markdown renderer.
 *
 * Supported block syntax (line-based):
 *   "## "  -> h2
 *   "### " -> h3
 *   "- "   -> unordered list (consecutive lines grouped)
 *   ""     -> spacing / list break
 *   else   -> paragraph
 *
 * Pure function: splits the input on "\n" and maps blocks to elements.
 */
export function Markdown({ content }: { content?: string | null }) {
  const lines = (content ?? "").split("\n");
  const nodes: ReactNode[] = [];
  let list: string[] = [];
  let key = 0;

  const flushList = () => {
    if (list.length === 0) return;
    const items = list;
    list = [];
    nodes.push(
      <ul
        key={`ul-${key++}`}
        className="list-disc pl-5 space-y-1 text-ink/75"
      >
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>,
    );
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      continue;
    }

    flushList();

    if (line.trim() === "") {
      continue;
    }

    if (line.startsWith("## ")) {
      nodes.push(
        <h2
          key={`h2-${key++}`}
          className="text-2xl font-semibold text-ink mt-8 mb-3"
        >
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      nodes.push(
        <h3
          key={`h3-${key++}`}
          className="text-xl font-semibold text-ink mt-6 mb-2"
        >
          {line.slice(4)}
        </h3>,
      );
    } else {
      nodes.push(
        <p
          key={`p-${key++}`}
          className="text-ink/75 leading-relaxed mb-4"
        >
          {line}
        </p>,
      );
    }
  }

  flushList();

  return <div className="prose-none max-w-none">{nodes}</div>;
}
