// mdx-components.tsx
import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    ),
    h2: ({ children }) => (
      <SectionHeader mode="label" level="h3" className="mt-8 mb-3">
        {children}
      </SectionHeader>
    ),
    h3: ({ children }) => (
      <SectionHeader mode="label" level="h3" className="mt-6 mb-2">
        {children}
      </SectionHeader>
    ),
    ...components,
  };
}

export const getMDXComponents = useMDXComponents;