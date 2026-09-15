import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger within a group, in ms. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}

/**
 * Fades + lifts children into view once, when they enter the viewport.
 *
 * Content is only hidden when the IntersectionObserver is available AND the
 * user hasn't asked for reduced motion. In every other case it renders visible
 * immediately, so the site never depends on JS or animation to be readable.
 */
export const Reveal = ({ children, delay = 0, className = "", as = "div" }: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const canAnimate =
    typeof window !== "undefined" && "IntersectionObserver" in window && !prefersReduced;

  const [visible, setVisible] = useState(!canAnimate);

  useEffect(() => {
    if (!canAnimate || !ref.current) return;
    const node = ref.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [canAnimate]);

  const Tag = as;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      className={`reveal ${className}`}
      data-visible={visible}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};
