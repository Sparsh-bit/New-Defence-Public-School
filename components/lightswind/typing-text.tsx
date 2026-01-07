"use client";

import { motion, Variants } from "framer-motion";
import React, {
  ElementType,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface TypingTextProps {
  children?: ReactNode;
  text?: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  letterSpacing?: string;
  align?: "left" | "center" | "right";
  loop?: boolean;
  style?: React.CSSProperties;
}

export const TypingText = ({
  children,
  text,
  as: Component = "div",
  className = "",
  delay = 0,
  duration = 2,
  fontSize = "text-4xl",
  fontWeight = "font-bold",
  color = "text-white",
  letterSpacing = "tracking-wide",
  align = "left",
  loop = false,
  style,
}: TypingTextProps) => {
  const [textContent, setTextContent] = useState<string>("");

  useEffect(() => {
    if (text) {
      setTextContent(text);
      return;
    }

    const extractText = (node: ReactNode): string => {
      if (typeof node === "string" || typeof node === "number") {
        return node.toString();
      }
      if (Array.isArray(node)) {
        return node.map(extractText).join("");
      }
      if (
        React.isValidElement(node) &&
        (node.props as any).children !== undefined
      ) {
        return extractText((node.props as any).children);
      }
      return "";
    };

    setTextContent(extractText(children));
  }, [children, text]);

  // Split text into words to control wrapping
  const words = textContent.split(" ");

  // Calculate total characters for animation staggering
  const totalChars = words.reduce((acc, word) => acc + word.length, 0);

  const characterVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: delay + i * (duration / (totalChars || 1)),
        duration: 0.3,
        ease: "easeInOut",
        repeat: loop ? Infinity : 0,
        repeatType: "reverse" as const,
        repeatDelay: 1,
      },
    }),
  };

  let charIndexOffset = 0;
  const Tag = Component as any;

  return (
    <Tag
      style={style}
      className={cn(
        "flex flex-wrap gap-x-[0.25em]",
        className,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        align === "center"
          ? "justify-center text-center"
          : align === "right"
            ? "justify-end text-right"
            : "justify-start text-left"
      )}
      aria-label={textContent}
    >
      {words.map((word, wIndex) => {
        const wordChars = word.split("");
        // Capture current offset for this word's characters
        const currentOffset = charIndexOffset;
        // increment global offset by word length (simulate space ignored in animation count or account for it?)
        // Usually better to stagger solely by visible chars.
        charIndexOffset += wordChars.length;

        return (
          <span key={`word-${wIndex}`} className="whitespace-nowrap inline-block">
            {wordChars.map((char, cIndex) => (
              <motion.span
                key={`${word}-${wIndex}-${cIndex}`}
                className="inline-block text-inherit"
                style={(color?.includes('white') || (style?.color === '#FFFFFF') || (style?.color === 'white')) ? { color: '#ffffff' } : undefined}
                variants={characterVariants}
                custom={currentOffset + cIndex}
                initial="hidden"
                animate="visible"
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
};
