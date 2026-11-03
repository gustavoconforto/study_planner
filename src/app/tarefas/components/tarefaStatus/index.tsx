"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTarefaStatus } from "../../actions";
import { TASK_STATUS } from "@/src/db/schema";
import { cn } from "@/lib/utils";

const statusLabels: Record<(typeof TASK_STATUS)[number], string> = {
  AGENDADO: "Agendada",
  CADASTRADO: "Na fila",
};
const taskStatusItems = TASK_STATUS.map((status) => ({
  label: statusLabels[status],
  value: status,
}));

export default function TaskStatus({
  taskId,
  status,
}: {
  taskId: number;
  status: string;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isPending, startTransition] = useTransition();

  function handleSelectStatus(value: string | null) {
    if (value === null || value === currentStatus) return;
    const previousStatus = currentStatus;
    setCurrentStatus(value);
    startTransition(async () => {
      const result = await updateTarefaStatus(
        taskId,
        value as (typeof TASK_STATUS)[number],
      );
      if (!result.ok) setCurrentStatus(previousStatus);
    });
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor={`status-${taskId}`} className="text-muted-foreground">
        Status
      </label>
      <Select
        items={taskStatusItems}
        value={currentStatus}
        onValueChange={handleSelectStatus}
        disabled={isPending}
      >
        <SelectTrigger id={`status-${taskId}`} size="sm">
          <span
            aria-hidden
            className={cn(
              "size-2 rounded-full",
              currentStatus === "AGENDADO" ? "bg-primary" : "bg-muted-foreground/40",
            )}
          />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {taskStatusItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
