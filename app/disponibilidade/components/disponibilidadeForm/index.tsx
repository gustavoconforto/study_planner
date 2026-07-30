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
export default function DisponibilidadeForm() {
  const [weekDay, setWeekDay] = useState("segunda");
  const [start, setStart] = useState("00:00:00");
  const [finish, setFinish] = useState("00:00:00");

  function handleSelectDiaDaSemana(value: string | null) {
    if (value) setWeekDay(value);
  }
  function handleStartInput(event: React.ChangeEvent<HTMLInputElement>) {
    setStart(event.target.value);
  }
  function handleFinishInput(event: React.ChangeEvent<HTMLInputElement>) {
    setFinish(event.target.value);
  }

  const items = [
    { label: "Domingo", value: "0" },
    { label: "Segunda-feira", value: "1" },
    { label: "Terça-feira", value: "2" },
    { label: "Quarta-feira", value: "3" },
    { label: "Quinta-feira", value: "4" },
    { label: "Sexta-feira", value: "5" },
    { label: "Sábado", value: "6" },
  ];

  return (
    <div className="flex flex-col gap-6 border-x px-10">
      {weekDay} -{start} -{finish}
      <Field>
        <FieldLabel>Seledione o dia</FieldLabel>
        <Select items={items} onValueChange={handleSelectDiaDaSemana}>
          <SelectTrigger>
            <SelectValue placeholder="Dia..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map((item) => (
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
      <Button variant="outline">Salvar</Button>
    </div>
  );
}
