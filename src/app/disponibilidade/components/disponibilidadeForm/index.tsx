"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
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
import { saveDisponibilidade } from "../../actions";
import { weekDays } from "@/utils/data";

export default function DisponibilidadeForm({
  userEmail,
}: {
  userEmail: string;
}) {
  const [weekday, setWeekDay] = useState(10);
  const [start, setStart] = useState("00:00:00");
  const [finish, setFinish] = useState("00:00:00");

  function handleSelectDiaDaSemana(value: number | null) {
    if (value !== null) setWeekDay(value);
  }
  function handleStartInput(event: React.ChangeEvent<HTMLInputElement>) {
    setStart(event.target.value);
  }
  function handleFinishInput(event: React.ChangeEvent<HTMLInputElement>) {
    setFinish(event.target.value);
  }

  function handleSaveButton() {
    if (weekday != 10 && start != "00:00:00" && finish != "00:00:00") {
      saveDisponibilidade({
        email: userEmail,
        weekday,
        start,
        finish,
      });
    }
  }

  return (
    <div className="flex flex-col gap-6 border-x px-10">
      <Field>
        <FieldLabel>Seledione o dia</FieldLabel>
        <Select items={weekDays} onValueChange={handleSelectDiaDaSemana}>
          <SelectTrigger>
            <SelectValue placeholder="Dia..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {weekDays.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="time-picker-inicio">Início</FieldLabel>
          <Input
            type="time"
            id="time-picker-inicio"
            step="1"
            defaultValue="00:00:00"
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            onChange={handleStartInput}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="time-picker-fim">Fim</FieldLabel>
          <Input
            type="time"
            id="time-picker-fim"
            step="1"
            defaultValue="00:00:00"
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            onChange={handleFinishInput}
          />
        </Field>
      </FieldGroup>
      <Button variant="outline" onClick={handleSaveButton}>
        Salvar
      </Button>
    </div>
  );
}
