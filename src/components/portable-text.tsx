import {
  PortableText as PortableTextRenderer,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "next-sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-8 text-zinc-300">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-semibold text-white">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold text-white">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-amber-500 pl-5 text-lg leading-8 text-zinc-200">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5 text-zinc-300">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-5 text-zinc-300">{children}</ol>
    ),
  },
};

interface PortableTextProps {
  tone?: "dark" | "light";
  value?: PortableTextBlock[];
}

export function PortableText({ tone = "light", value }: PortableTextProps) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className={tone === "dark" ? "space-y-5 text-zinc-300" : "space-y-5"}>
      <PortableTextRenderer
        components={tone === "dark" ? darkComponents : components}
        value={value}
      />
    </div>
  );
}

const darkComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-8 text-zinc-300">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-semibold text-white">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold text-white">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-amber-500 pl-5 text-lg leading-8 text-zinc-200">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5 text-zinc-300">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-5 text-zinc-300">{children}</ol>
    ),
  },
};
