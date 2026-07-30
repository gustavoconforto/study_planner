"use client";

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
  const [diaDaSemana, setDiaDaSemana] = useState("segunda");

  function handleSelectDiaDaSemana(value: string | null) {
    if (value) setDiaDaSemana(value);
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
    <div className="flex flex-col gap-5">
      {diaDaSemana}
      <Field>
        <FieldLabel>Seledione o dia</FieldLabel>
        <Select items={items} onValueChange={handleSelectDiaDaSemana}>
          <SelectTrigger className="w-[180px]">
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
      <FieldGroup className="mx-auto max-w-xs flex-row">
        <Field className="w-32">
          <FieldLabel htmlFor="time-picker-optional">Início</FieldLabel>
          <Input
            type="time"
            id="time-picker-optional"
            step="1"
            defaultValue="10:30:00"
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>
        <Field className="w-32">
          <FieldLabel htmlFor="time-picker-optional">Fim</FieldLabel>
          <Input
            type="time"
            id="time-picker-optional"
            step="1"
            defaultValue="10:30:00"
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>
      </FieldGroup>
    </div>
  );
}
