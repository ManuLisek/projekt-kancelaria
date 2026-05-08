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
      <blockquote className="relative overflow-hidden border border-amber-500/25 bg-amber-500/5 px-6 py-5 text-lg leading-8 text-zinc-100 sm:px-8">
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-1 bg-amber-400"
        />
        <span
          aria-hidden
          className="absolute right-5 top-2 text-6xl font-semibold leading-none text-amber-300/10"
        >
          &quot;
        </span>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="space-y-3 text-zinc-300">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-3 pl-5 text-zinc-300 marker:font-semibold marker:text-amber-300">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-6 leading-8 before:absolute before:left-0 before:top-3 before:size-2 before:bg-amber-300">
        {children}
      </li>
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
      <blockquote className="relative overflow-hidden border border-amber-500/25 bg-amber-500/5 px-6 py-5 text-lg leading-8 text-zinc-100 sm:px-8">
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-1 bg-amber-400"
        />
        <span
          aria-hidden
          className="absolute right-5 top-2 text-6xl font-semibold leading-none text-amber-300/10"
        >
          &quot;
        </span>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="space-y-3 text-zinc-300">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-3 pl-5 text-zinc-300 marker:font-semibold marker:text-amber-300">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-6 leading-8 before:absolute before:left-0 before:top-3 before:size-2 before:bg-amber-300">
        {children}
      </li>
    ),
  },
};
