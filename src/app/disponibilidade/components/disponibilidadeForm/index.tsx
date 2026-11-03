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
import { cn } from "@/lib/utils";
import { saveDisponibilidade, type DisponibilidadeErrors } from "../../actions";
import { weekDays } from "@/utils/data";

export default function DisponibilidadeForm() {
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
    setFeedback(null);
    setIsSaving(true);
    try {
      const response = await saveDisponibilidade({ weekday, start, finish });

      setErrors(response.ok ? {} : response.errors);
      if (response.ok) {
        setFeedback({
          type: "success",
          message: "Disponibilidade salva com sucesso!",
        });
        setWeekDay(10);
        setStart("00:00:00");
        setFinish("00:00:00");
      } else if (Object.keys(response.errors).length === 0) {
        setFeedback({
          type: "error",
          message:
            "Não foi possível salvar a disponibilidade. Tente novamente.",
        });
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
