import { Button } from "@/components/ui/button";

type HeaderParams = {
  title: string;
  subtitle?: string;
  actions?: boolean;
};

export default function Header({ title, subtitle, actions }: HeaderParams) {
  return (
    <div className="w-full px-10 py-5">
      <div
        role="banner"
        aria-label="Único Planner"
        className="flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold">{title}</h1>
        </div>

        <span className="text-lg font-semibold text-muted-foreground">
          {subtitle}
        </span>

        {actions && (
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="destructive" size="lg">
              Criar minha primeira agenda
            </Button>
            <Button variant="outline" size="lg">
              Ver como funciona
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
