import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
            <div>
              <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                <Link href="/">
                  <span className="text-xl font-medium tracking-wider text-gray-700 dark:text-gray-200">
                    Único
                    <span className="font-extrabold text-red-600">planner</span>
                  </span>
                </Link>

                <div className="flex flex-1 items-center justify-end md:justify-between">
                  <nav aria-label="Global" className="hidden md:block">
                    <ul className="flex items-center gap-6 text-sm">
                      <li>
                        <a
                          className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                          href="#"
                        >
                          Dashboard
                        </a>
                      </li>

                      <li>
                        <a
                          className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                          href="disponibilidade"
                        >
                          Disponibilidade
                        </a>
                      </li>

                      <li>
                        <a
                          className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                          href="#"
                        >
                          Tarefas
                        </a>
                      </li>

                      <li>
                        <a
                          className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                          href="#"
                        >
                          Agenda
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="px-4">
                <nav aria-label="Global" className="block md:hidden pb-4">
                  <ul className="flex fllex-col items-center gap-6 text-sm">
                    <li>
                      <a
                        className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                        href="#"
                      >
                        Dashboard
                      </a>
                    </li>

                    <li>
                      <a
                        className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                        href="disponibilidade"
                      >
                        Disponibilidade
                      </a>
                    </li>

                    <li>
                      <a
                        className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                        href="#"
                      >
                        Tarefas
                      </a>
                    </li>

                    <li>
                      <a
                        className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                        href="#"
                      >
                        Agenda
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
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
