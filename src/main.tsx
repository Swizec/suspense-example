import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/inter";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <CssVarsProvider>
            <CssBaseline />

            <App />
        </CssVarsProvider>
    </React.StrictMode>
);
