import type { Metadata } from "next";
import {
  Atkinson_Hyperlegible_Mono,
  Atkinson_Hyperlegible_Next,
} from "next/font/google";
import { ClerkProvider, Show, SignInButton, UserButton } from "@clerk/nextjs";

import "./globals.css";
import { cn } from "@/lib/utils";

import Navbar from "./layout/Navbar";
import { Button } from "@/components/ui/button";

// Atkinson Hyperlegible was drawn for readers who struggle to tell letters apart: right for a school app.
const sans = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});
const mono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
});

export const metadata: Metadata = {
  title: "Uníco studyPlanner",
  description: "Gerador de planejamento de horários inteligente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-light-theme="light"
      data-dark-theme="dark"
      data-color-mode="light"
      className={cn("h-full antialiased font-sans", sans.variable, mono.variable)}
    >
      <body className="min-h-full flex flex-col w-full">
        <ClerkProvider>
          <header className="border-b bg-card">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:px-6">
              <Navbar />
              <div className="ml-auto flex items-center">
                <Show when="signed-out">
                  <SignInButton>
                    <Button variant="outline">Entrar</Button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
