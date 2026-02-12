'use client';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/auth/AuthContext";
import { useState } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="ko">
      <head>
        <title>Dooring Partners</title>
        <meta name="description" content="Dooring Partners Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              {children}
              <Toaster />
              <Sonner />
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
