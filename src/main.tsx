import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MDXProvider } from "@mdx-js/react";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { mdxComponents } from "./mdx-components";
import "./app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MDXProvider components={mdxComponents}>
      <HashRouter>
        <App />
      </HashRouter>
    </MDXProvider>
  </StrictMode>,
);
