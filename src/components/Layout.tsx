import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLinkEmphasis } from "../hooks/useLinkEmphasis";

export function Layout() {
  const { pathname } = useLocation();
  useLinkEmphasis();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <Outlet />
      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}
