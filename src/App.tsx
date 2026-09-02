import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ResumePage } from "./pages/ResumePage";
import { ContactPage } from "./pages/ContactPage";
import { ProjectsIndex } from "./pages/ProjectsIndex";
import { ProjectPage } from "./pages/ProjectPage";
import { defaultLang, isLang, resolveInitialLang } from "./i18n";

const AdminApp = import.meta.env.DEV ? lazy(() => import("./admin").then((m) => ({ default: m.AdminApp }))) : null;

/** Redirect unknown `/:lang` segments to the default language. */
function LangGuard({ children }: { children: React.ReactNode }) {
  const { lang } = useParams();
  const location = useLocation();
  if (!isLang(lang)) {
    const rest = location.pathname.split("/").slice(2).join("/");
    return <Navigate to={`/${defaultLang}/${rest}`} replace />;
  }
  return <>{children}</>;
}

export function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to={`/${resolveInitialLang()}/resume/`} replace />} />
        {AdminApp && (
          <Route
            path="/admin"
            element={
              <Suspense fallback={null}>
                <AdminApp />
              </Suspense>
            }
          />
        )}
        <Route
          path="/:lang"
          element={
            <LangGuard>
              <Layout />
            </LangGuard>
          }
        >
          <Route index element={<Navigate to="resume" replace />} />
          <Route path="home" element={<Navigate to="../resume" replace />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="projects" element={<ProjectsIndex />} />
          <Route path="projects/:slug" element={<ProjectPage />} />
          <Route path="*" element={<Navigate to="resume" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
