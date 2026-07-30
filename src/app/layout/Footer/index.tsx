export default function Footer() {
  return (
    <div className="w-full border-t border-red-100 px-20 flex items-center justify-between">
      <div className="flex flex-col gap-2 my-4">
        <span className="text-lg font-medium tracking-wider text-gray-700">
          Único<span className="font-extrabold text-red-600">planner</span>
        </span>
        <p className="max-w-xs text-sm text-muted-foreground">
          Cronogramas e tarefas organizados sem esforço.
        </p>
      </div>

      <span>
        Feito por{" "}
        <a
          href="https://github.com/broccolinisoup"
          className="font-semibold"
        >
          Gustavo Conforto
        </a>
      </span>
    </div>
  );
}
