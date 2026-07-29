"use client";

import { RelativeTime } from "@primer/react";
import { Table, DataTable } from "@primer/react/experimental";

export default function DisponibilidadeData() {
  return (
    <Table.Container>
      <Table.Title as="h2" id="repositories-default">
        Repositories
      </Table.Title>
      <DataTable
        aria-labelledby="repositories-default"
        data={data}
        columns={[
          {
            header: "Repository",
            field: "name",
            rowHeader: true,
          },
          {
            header: "Type",
            field: "type",
          },
          {
            header: "Updated",
            field: "updatedAt",
            renderCell: (row) => {
              return <RelativeTime date={new Date(row.updatedAt)} />;
            },
          },
          {
            header: "Dependabot",
            field: "securityFeatures.dependabot",
          },
          {
            header: "Code scanning",
            field: "securityFeatures.codeScanning",
          },
        ]}
      />
    </Table.Container>
  );
}

const now = Date.now();
const Second = 1000;
const Minute = 60 * Second;
const Hour = 60 * Minute;
const Day = 24 * Hour;
const Week = 7 * Day;
const Month = 4 * Week;

const data: Array<{
  id: number;
  name: string;
  type: "Public" | "Internal";
  updatedAt: number;
  securityFeatures: {
    dependabot: string;
    codeScanning: string;
  };
}> = [
  {
    id: 1,
    name: "codeql-dca-worker",
    type: "Internal",
    updatedAt: now,
    securityFeatures: {
      dependabot: "Alerts",
      codeScanning: "Report secrets",
    },
  },
  {
    id: 2,
    name: "aegir",
    type: "Public",
    updatedAt: now - 5 * Minute,
    securityFeatures: {
      dependabot: "Alerts",
      codeScanning: "Report secrets",
    },
  },
  {
    id: 3,
    name: "strapi",
    type: "Public",
    updatedAt: now - 1 * Hour,
    securityFeatures: {
      dependabot: "",
      codeScanning: "",
    },
  },
  {
    id: 4,
    name: "codeql-ci-nightlies",
    type: "Public",
    updatedAt: now - 6 * Hour,
    securityFeatures: {
      dependabot: "Alerts",
      codeScanning: "",
    },
  },
  {
    id: 5,
    name: "dependabot-updates",
    type: "Public",
    updatedAt: now - 1 * Day,
    securityFeatures: {
      dependabot: "",
      codeScanning: "",
    },
  },
  {
    id: 6,
    name: "tsx-create-react-app",
    type: "Public",
    updatedAt: now - 1 * Week,
    securityFeatures: {
      dependabot: "",
      codeScanning: "",
    },
  },
  {
    id: 7,
    name: "bootstrap",
    type: "Public",
    updatedAt: now - 1 * Month,
    securityFeatures: { dependabot: "Alerts", codeScanning: "" },
  },
  {
    id: 8,
    name: "docker-templates",
    type: "Public",
    updatedAt: now - 3 * Month,
    securityFeatures: {
      dependabot: "Alerts",
      codeScanning: "",
    },
  },
];
