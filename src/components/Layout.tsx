import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLinkEmphasis } from "../hooks/useLinkEmphasis";

export function Layout() {
  useLinkEmphasis();

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
