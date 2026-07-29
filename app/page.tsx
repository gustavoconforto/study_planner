"use client";

import React from "react";
import { PageLayout } from "@primer/react";

export default function Home() {
  return (
    <PageLayout>
      <PageLayout.Header>
        <Placeholder height={64}>Header</Placeholder>
      </PageLayout.Header>
      <PageLayout.Content>
        <Placeholder height={400}>Content</Placeholder>
      </PageLayout.Content>
      <PageLayout.Pane>
        <Placeholder height={200}>Pane</Placeholder>
      </PageLayout.Pane>
      <PageLayout.Footer>
        <Placeholder height={64}>Footer</Placeholder>
      </PageLayout.Footer>
    </PageLayout>
  );
}

function Placeholder({
  height,
  children,
}: {
  height: number | string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height,
        display: "grid",
        placeItems: "center",
        backgroundColor: "var(--bgColor-inset)",
        borderRadius: "var(--borderRadius-medium)",
        border: "1px solid var(--borderColor-muted)",
      }}
    >
      {children}
    </div>
  );
}
