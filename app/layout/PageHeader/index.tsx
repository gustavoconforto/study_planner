"use client";

import React from "react";
import { PageHeader, Button } from "@primer/react";
import { RocketIcon } from "@primer/octicons-react";

export default function Header() {
  return (
    <div className="w-full px-20 py-10 sm:py-16">
      <PageHeader role="banner" aria-label="Único Planner">
        <PageHeader.TitleArea variant="large">
          <PageHeader.LeadingVisual>
            <span className="flex size-10 items-center justify-center rounded-full bg-red-600 text-white">
              <RocketIcon size={20} />
            </span>
          </PageHeader.LeadingVisual>
          <PageHeader.Title as="h1">
            Organize sua agenda em um só lugar
          </PageHeader.Title>
        </PageHeader.TitleArea>

        <PageHeader.Description>
          <div className="flex max-w-2xl flex-col gap-3">
            <span
              style={{
                fontSize: "var(--text-body-size-large)",
                color: "var(--fgColor-muted)",
              }}
              className="font-semibold"
            >
              Crie cronogramas, distribua tarefas e acompanhe o progresso de
              cada turma em tempo real — tudo em uma interface simples e
              objetiva.
            </span>
          </div>
        </PageHeader.Description>

        <PageHeader.Actions>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="danger" size="large">
              Criar minha primeira agenda
            </Button>
            <Button variant="default" size="large">
              Ver como funciona
            </Button>
          </div>
        </PageHeader.Actions>
      </PageHeader>
    </div>
  );
}
