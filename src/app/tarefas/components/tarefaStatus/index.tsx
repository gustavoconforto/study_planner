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

const taskStatusItems = TASK_STATUS.map((status) => ({
  label: status,
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
    <div className="flex justify-between items-center gap-2">
      <span className="text-muted-foreground font-semibold">Status:&nbsp;</span>
      <Select
        items={taskStatusItems}
        value={currentStatus}
        onValueChange={handleSelectStatus}
        disabled={isPending}
      >
        <SelectTrigger
          id={`status-${taskId}`}
          className={
            currentStatus === "AGENDADO"
              ? "font-bold text-green-600"
              : "font-bold text-orange-600"
          }
        >
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
