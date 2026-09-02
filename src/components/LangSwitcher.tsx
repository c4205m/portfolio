import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { languages, useLang } from "../i18n";
import type { Lang } from "../types/content";

const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  tr: "Türkçe",
};

const LANG_FLAGS: Record<Lang, string> = {
  en: "🇬🇧",
  tr: "🇹🇷",
};

function swapLang(pathname: string, next: Lang): string {
  const segments = pathname.split("/");
  // segments[0] is "" (leading slash); segments[1] is the lang.
  if (segments.length > 1) segments[1] = next;
  return segments.join("/");
}

export function LangSwitcher() {
  const lang = useLang();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const closeAndRefocus = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open && activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const openAt = (index: number) => {
    setOpen(true);
    setActiveIndex(index);
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
      case "Enter":
      case " ":
        e.preventDefault();
        openAt(0);
        break;
      case "ArrowUp":
        e.preventDefault();
        openAt(languages.length - 1);
        break;
      case "Escape":
        if (open) closeAndRefocus();
        break;
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const last = languages.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i >= last ? 0 : i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? last : i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(last);
        break;
      case "Escape":
      case "Tab":
        closeAndRefocus();
        break;
    }
  };

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 520, damping: 34, mass: 0.7 };

  return (
    <div className="lang-switcher" ref={rootRef} onKeyDown={open ? onMenuKeyDown : undefined}>
      <button
        ref={triggerRef}
        type="button"
        className="lang-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Language: ${LANG_NAMES[lang]}`}
        onClick={() => (open ? closeAndRefocus() : openAt(-1))}
        onKeyDown={onTriggerKeyDown}
      >
        <span aria-hidden="true">{lang}</span>
        <svg className="lang-caret" viewBox="0 0 12 12" width="9" height="9" aria-hidden="true">
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="lang-options"
            initial={{ opacity: 0, y: -4, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.96, transition: { duration: reduceMotion ? 0 : 0.12 } }}
            transition={transition}
          >
            <div className="lang-options-list" role="menu" aria-label="Select language">
              {languages.map((l, i) => (
                <Link
                  key={l}
                  ref={(node) => {
                    itemRefs.current[i] = node;
                  }}
                  role="menuitemradio"
                  aria-checked={l === lang}
                  lang={l}
                  tabIndex={i === activeIndex ? 0 : -1}
                  className="lang-option"
                  to={swapLang(location.pathname, l)}
                  onClick={() => {
                    setOpen(false);
                    setActiveIndex(-1);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <span className="lang-flag" aria-hidden="true">
                    {LANG_FLAGS[l]}
                  </span>
                  <span className="lang-option-label">{LANG_NAMES[l]}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
