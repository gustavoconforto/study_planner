"use client";

import { ButtonGroup, Button } from "@primer/react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-start gap-4 md:gap-8">
          <Link href="/">
            <span className="text-xl font-medium tracking-wider text-gray-700 dark:text-gray-200">
              Único<span className="font-extrabold text-red-600">planner</span>
            </span>
          </Link>
        </div>
        <ButtonGroup>
          <Button>Dashboard</Button>
          <Link href="disponibilidade">
            <Button>Disponibilidade</Button>
          </Link>
          <Button>Tarefas</Button>
          <Button>Agenda</Button>
        </ButtonGroup>
      </div>
    </header>
  );
}
