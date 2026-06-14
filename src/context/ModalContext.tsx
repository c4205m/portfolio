import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ModalContextValue {
  /** Key of the gallery section currently expanded into mobile modal mode. */
  activeKey: string | null;
  open: (key: string) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const open = useCallback((key: string) => setActiveKey(key), []);
  const close = useCallback(() => setActiveKey(null), []);

  const value = useMemo(() => ({ activeKey, open, close }), [activeKey, open, close]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
