import Link from "next/link";

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
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 md:h-16 md:flex-row md:items-center md:gap-8 md:py-0 lg:px-8">
      <Link href="/">
        <span className="text-xl font-medium tracking-wider text-gray-700 dark:text-gray-200">
          Único
          <span className="font-extrabold text-red-600">planner</span>
        </span>
      </Link>

      <nav aria-label="Global">
        <ul className="flex flex-wrap items-center gap-6 text-sm">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                href={item.href}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
