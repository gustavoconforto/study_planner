"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems: { href: string; title: string }[] = [
  {
    href: "/planner",
    title: "Planner",
  },
  {
    href: "/disponibilidade",
    title: "Disponibilidade",
  },
  {
    href: "/tarefas",
    title: "Tarefas",
  },
  {
    href: "/agenda",
    title: "Agenda",
  },
  {
    href: "/chat",
    title: "Chat",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="contents">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        Único planner
      </Link>

      {/* On phones the menu takes its own row below the logo and account button. */}
      <nav aria-label="Principal" className="order-last w-full md:order-none md:w-auto">
        <ul className="-mx-2 flex flex-wrap items-center gap-1 text-sm">
          {menuItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    active && "bg-accent font-medium text-accent-foreground",
                  )}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
