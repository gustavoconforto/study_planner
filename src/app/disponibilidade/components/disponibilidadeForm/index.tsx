"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { saveDisponibilidade } from "../../actions";
import { weekDays } from "@/utils/data";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const disponibilidadeSchema = z
  .object({
    weekday: z
      .number()
      .min(0, "Selecione um dia da semana")
      .max(6, "Selecione um dia da semana"),
    start: z.string().regex(timeRegex, "Informe um horário inicial válido"),
    finish: z.string().regex(timeRegex, "Informe um horário final válido"),
  })
  .refine((data) => data.finish > data.start, {
    message: "O horário final deve ser depois do horário inicial",
    path: ["finish"],
  });

type DisponibilidadeErrors = Partial<
  Record<"weekday" | "start" | "finish", string[]>
>;

export default function DisponibilidadeForm({
  userEmail,
}: {
  userEmail: string;
}) {
  const [weekday, setWeekDay] = useState(10);
  const [start, setStart] = useState("00:00:00");
  const [finish, setFinish] = useState("00:00:00");
  const [errors, setErrors] = useState<DisponibilidadeErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function handleSelectDiaDaSemana(value: number | null) {
    if (value !== null) setWeekDay(value);
  }
  function handleStartInput(event: React.ChangeEvent<HTMLInputElement>) {
    setStart(event.target.value);
  }
  function handleFinishInput(event: React.ChangeEvent<HTMLInputElement>) {
    setFinish(event.target.value);
  }

  async function handleSaveButton() {
    const result = disponibilidadeSchema.safeParse({ weekday, start, finish });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      setFeedback(null);
      return;
    }

    setErrors({});
    setFeedback(null);
    setIsSaving(true);
    try {
      const response = await saveDisponibilidade({
        email: userEmail,
        weekday: result.data.weekday,
        start: result.data.start,
        finish: result.data.finish,
      });

      setFeedback(
        response.ok
          ? { type: "success", message: "Disponibilidade salva com sucesso!" }
          : {
              type: "error",
              message:
                "Não foi possível salvar a disponibilidade. Tente novamente.",
            },
      );

      if (response.ok) {
        setWeekDay(10);
        setStart("00:00:00");
        setFinish("00:00:00");
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Não foi possível salvar a disponibilidade. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 border-x px-10 w-full max-w-md">
      <FieldGroup>
        <Field data-invalid={!!errors.weekday}>
          <FieldLabel htmlFor="weekday">Dia da semana</FieldLabel>
          <Select
            items={weekDays}
            value={weekday === 10 ? null : weekday}
            onValueChange={handleSelectDiaDaSemana}
          >
            <SelectTrigger id="weekday" className="w-full">
              <SelectValue placeholder="Selecione um dia" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {weekDays.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError
            errors={errors.weekday?.map((message) => ({ message }))}
          />
        </Field>

        <Field data-invalid={!!errors.start}>
          <FieldLabel htmlFor="start">Horário inicial</FieldLabel>
          <Input
            id="start"
            type="time"
            placeholder="00:00"
            value={start}
            onChange={handleStartInput}
            aria-invalid={!!errors.start}
          />
          <FieldError errors={errors.start?.map((message) => ({ message }))} />
        </Field>

        <Field data-invalid={!!errors.finish}>
          <FieldLabel htmlFor="finish">Horário final</FieldLabel>
          <Input
            id="finish"
            placeholder="00:00"
            type="time"
            value={finish}
            onChange={handleFinishInput}
            aria-invalid={!!errors.finish}
          />
          <FieldError errors={errors.finish?.map((message) => ({ message }))} />
        </Field>

        <Button
          variant="secondary"
          type="button"
          onClick={handleSaveButton}
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>

        {feedback && (
          <p
            role="status"
            className={cn(
              "text-sm",
              feedback.type === "success" ? "text-primary" : "text-destructive",
            )}
          >
            {feedback.message}
          </p>
        )}
      </FieldGroup>
    </div>
  );
}
