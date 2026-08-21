import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ClerkProvider, Show, SignInButton, UserButton } from "@clerk/nextjs";

import "./globals.css";
import { cn } from "@/lib/utils";

import Navbar from "./layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      lang="en"
      data-light-theme="light"
      data-dark-theme="dark"
      data-color-mode="light"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col w-full">
        <ClerkProvider>
          <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 flex justify-between">
            <Navbar />
            <div className="flex pr-10">
              <Show when="signed-out">
                <SignInButton />
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
        </ClerkProvider>
        {children}
      </body>
    </html>
  );
}
