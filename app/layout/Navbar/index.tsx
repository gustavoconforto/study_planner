import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
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
                    className="rounded-md bg-lime-100 px-3 py-2 text-sm font-medium text-lime-700 dark:bg-lime-900/50 dark:text-lime-300"
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

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <a
                  className="block shrink-0 rounded-full bg-white p-2.5 text-gray-600 transition hover:text-gray-700 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                  href="#"
                >
                  <span className="sr-only">Notifications</span>
                </a>
              </div>

              <a href="#" className="block shrink-0">
                <span className="sr-only">Profile</span>
              </a>

              <button className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden dark:bg-gray-800 dark:text-white dark:hover:text-white/75">
                <span className="sr-only">Toggle menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
