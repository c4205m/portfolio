import { useLayoutEffect, useRef } from "react";

interface AutoTextareaProps {
  value: string;
  onChange: (v: string) => void;
  className: string;
  placeholder: string;
}

export function AutoTextarea({ value, onChange, className, placeholder }: AutoTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight}px`;
  }, [value]);

  return <textarea ref={ref} className={className} rows={1} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}
