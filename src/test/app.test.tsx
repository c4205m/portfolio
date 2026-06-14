import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import { ThemeProvider } from "../context/ThemeContext";
import { ModalProvider } from "../context/ModalContext";
import { ProjectsIndex } from "../pages/ProjectsIndex";
import { ContactPage } from "../pages/ContactPage";
import { App } from "../App";
import { isLang, resolveInitialLang } from "../i18n";

function renderAt(path: string, routePath: string, element: ReactElement) {
  return render(
    <ThemeProvider>
      <ModalProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path={routePath} element={element} />
          </Routes>
        </MemoryRouter>
      </ModalProvider>
    </ThemeProvider>,
  );
}

describe("i18n helpers", () => {
  it("recognizes supported languages", () => {
    expect(isLang("en")).toBe(true);
    expect(isLang("tr")).toBe(true);
    expect(isLang("de")).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });

  it("resolves an initial language", () => {
    expect(["en", "tr"]).toContain(resolveInitialLang());
  });
});

describe("App", () => {
  it("redirects the root to the resume page and renders it", async () => {
    render(
      <ThemeProvider>
        <ModalProvider>
          <MemoryRouter initialEntries={["/"]}>
            <App />
          </MemoryRouter>
        </ModalProvider>
      </ThemeProvider>,
    );

    // Resume page heading from resume.json basics.label.
    expect(await screen.findByText("Technical Artist")).toBeInTheDocument();
  });
});

describe("ProjectsIndex", () => {
  it("lists all projects and filters by tag without crashing", async () => {
    renderAt("/en/projects", "/:lang/projects", <ProjectsIndex />);

    expect(screen.getByText("THORN — Parametric Lighting System")).toBeInTheDocument();
    expect(screen.getByText("Azuki: Elemental XR Experience")).toBeInTheDocument();
    expect(screen.getByText("Snapchat Lenses")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "VFX" }));
    expect(screen.getByText("Azuki: Elemental XR Experience")).toBeInTheDocument();
  });
});

describe("ContactPage", () => {
  it("shows validation errors on empty submit", async () => {
    renderAt("/en/contact", "/:lang/contact", <ContactPage />);

    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your email.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a message.")).toBeInTheDocument();
  });
});
