import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useScrollReveal } from "../hooks/useScrollReveal";

export function Layout() {
  useScrollReveal();

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
