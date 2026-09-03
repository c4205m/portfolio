import { useEffect, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLinkEmphasis } from "../hooks/useLinkEmphasis";
import { LANG_KEY, useLang } from "../i18n";

export function Layout() {
  const { pathname } = useLocation();
  const lang = useLang();
  useLinkEmphasis();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
