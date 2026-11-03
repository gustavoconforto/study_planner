import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type HeaderParams = {
  title: string;
  subtitle?: string;
  actions?: boolean;
};

export default function Header({ title, subtitle, actions }: HeaderParams) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-8 sm:px-6">
      <div className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>

        {subtitle && (
          <p className="text-base text-pretty text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        )}

        {actions && (
          <div className="flex flex-wrap gap-3 pt-3">
            <Link href="/disponibilidade" className={buttonVariants({ size: "lg" })}>
              Criar minha primeira agenda
            </Link>
            <Link
              href="#como-funciona"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Ver como funciona
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
