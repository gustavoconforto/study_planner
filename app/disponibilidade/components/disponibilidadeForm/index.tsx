"use client";

import { FormControl, Select, Button } from "@primer/react";
import { useState, type ChangeEvent } from "react";
export default function DisponibilidadeForm() {
  const [diaDaSemana, setDiaDaSemana] = useState("segunda");

  function handleSelectDiaDaSemana(event: ChangeEvent<HTMLSelectElement>) {
    setDiaDaSemana(event.target.value);
  }

  const horas = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
  ];

  const minutos = ["00", "15", "30", "45"];
  return (
    <div className="flex flex-col gap-4">
      <FormControl>
        <FormControl.Label>Selecione o dia</FormControl.Label>
        <Select onChange={handleSelectDiaDaSemana}>
          <Select.Option value="segunda">Segunda-Feira</Select.Option>
          <Select.Option value="terca">Terça-Feira</Select.Option>
          <Select.Option value="quarta">Quarta-Feira</Select.Option>
          <Select.Option value="quinta">Quinta-Feira</Select.Option>
          <Select.Option value="sexta">Sexta-Feira</Select.Option>
          <Select.Option value="sabado">Sábado</Select.Option>
          <Select.Option value="domingo">Domingo</Select.Option>
        </Select>
      </FormControl>

      <div className="flex flex-row gap-2">
        <FormControl>
          <FormControl.Label>Hora</FormControl.Label>
          <Select onChange={handleSelectDiaDaSemana}>
            {horas.map((hora) => {
              return (
                <Select.Option key={`${hora}:00`} value={hora}>
                  {hora}
                </Select.Option>
              );
            })}
          </Select>
        </FormControl>

        <FormControl>
          <FormControl.Label>Minuto</FormControl.Label>
          <Select onChange={handleSelectDiaDaSemana}>
            {minutos.map((minuto) => {
              return (
                <Select.Option key={minuto} value={minuto}>
                  {minuto}
                </Select.Option>
              );
            })}
          </Select>
        </FormControl>
        <h1 className="flex items-center">→</h1>
        <FormControl>
          <FormControl.Label>Hora</FormControl.Label>
          <Select onChange={handleSelectDiaDaSemana}>
            {horas.map((hora) => {
              return (
                <Select.Option key={`${hora}:00`} value={hora}>
                  {hora}
                </Select.Option>
              );
            })}
          </Select>
        </FormControl>

        <FormControl>
          <FormControl.Label>Minuto</FormControl.Label>
          <Select onChange={handleSelectDiaDaSemana}>
            {minutos.map((minuto) => {
              return (
                <Select.Option key={minuto} value={minuto}>
                  {minuto}
                </Select.Option>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <Button>Salvar</Button>
    </div>
  );
}
