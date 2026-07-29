"use client";

import { SegmentedControl } from "@primer/react";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-start gap-4 md:gap-8">
          <span className="text-xl font-medium tracking-wider text-gray-700 dark:text-gray-200">
            Único<span className="font-extrabold text-red-600">planner</span>
          </span>
        </div>
        <SegmentedControl aria-label="File view" size="medium">
          <SegmentedControl.Button defaultSelected>
            Dashboard
          </SegmentedControl.Button>
          <SegmentedControl.Button>Tarefas</SegmentedControl.Button>
          <SegmentedControl.Button>Agenda</SegmentedControl.Button>
        </SegmentedControl>
      </div>
    </header>
  );
}
