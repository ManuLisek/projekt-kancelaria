import {
  PortableText as PortableTextRenderer,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "next-sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-8 text-zinc-700">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-semibold text-zinc-950">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold text-zinc-950">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-amber-700 pl-5 text-lg leading-8 text-zinc-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5 text-zinc-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-5 text-zinc-700">{children}</ol>
    ),
  },
};

interface PortableTextProps {
  value?: PortableTextBlock[];
}

export function PortableText({ value }: PortableTextProps) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className="space-y-5">
      <PortableTextRenderer components={components} value={value} />
    </div>
  );
}
