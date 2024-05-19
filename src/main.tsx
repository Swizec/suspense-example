import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/inter";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WikipediaBirthdays } from "./WikipediaBirthdays";

const queryClient = new QueryClient();

function App() {
    return (
        <CssVarsProvider>
            <QueryClientProvider client={queryClient}>
                <CssBaseline />

                <Stack
                    direction="column"
                    alignItems="center"
                    spacing={3}
                    padding={4}
                >
                    <Typography level="h1">
                        Today's Birthdays from Wikipedia
                    </Typography>
                    <WikipediaBirthdays day={new Date()} />
                </Stack>
            </QueryClientProvider>
        </CssVarsProvider>
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
