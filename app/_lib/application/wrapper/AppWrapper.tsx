"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ReactNode, Suspense } from "react";
import { theme } from "@/app/_lib/mui/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/_lib/tanstack-query/client";
import { SnackbarProvider } from "../snackbar/snackbar";

export default function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
}
