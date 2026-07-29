"use client";

import React from "react";
import { PageHeader, Button } from "@primer/react";
import { RocketIcon } from "@primer/octicons-react";

type HeaderParams = {
  title: string;
  subtitle?: string;
  actions?: boolean;
};

export default function Header({ title, subtitle, actions }: HeaderParams) {
  return (
    <div className="w-full px-20 py-10 sm:py-16">
      <PageHeader role="banner" aria-label="Único Planner">
        <PageHeader.TitleArea variant="large">
          <PageHeader.LeadingVisual>
            <span className="flex size-10 items-center justify-center rounded-full bg-red-600 text-white">
              <RocketIcon size={20} />
            </span>
          </PageHeader.LeadingVisual>
          <PageHeader.Title as="h1">{title}</PageHeader.Title>
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
              {subtitle}
            </span>
          </div>
        </PageHeader.Description>
        {actions && (
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
        )}
      </PageHeader>
    </div>
  );
}
