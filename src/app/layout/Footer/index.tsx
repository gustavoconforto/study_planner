export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Único planner</span>
          <p className="text-muted-foreground">
            Cronogramas e tarefas organizados sem esforço.
          </p>
        </div>

        <span className="text-muted-foreground">
          Feito por{" "}
          <a
            href="https://github.com/broccolinisoup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Gustavo Conforto
          </a>
        </span>
      </div>
    </footer>
  );
}
