"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { saveTarefa, type TarefaErrors } from "../../actions";
import { TASK_TYPE, TASK_DIFICULTY, TASK_SUBJECT } from "@/src/db/schema";

const taskTypeItems = TASK_TYPE.map((type) => ({ label: type, value: type }));
const taskDificultyItems = TASK_DIFICULTY.map((dificulty) => ({
  label: dificulty,
  value: dificulty,
}));
const taskSubjectItems = TASK_SUBJECT.map((subject) => ({
  label: subject,
  value: subject,
}));

export default function TarefaForm() {
  const [type, setType] = useState("");
  const [dificulty, setDificulty] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<TarefaErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function handleSelectType(value: string | null) {
    if (value !== null) setType(value);
  }
  function handleSelectDificulty(value: string | null) {
    if (value !== null) setDificulty(value);
  }
  function handleSelectSubject(value: string | null) {
    if (value !== null) setSubject(value);
  }

  async function handleSaveButton() {
    setFeedback(null);
    setIsSaving(true);
    try {
      const response = await saveTarefa({
        type,
        dificulty,
        subject,
        title,
        theme,
        description,
        estimated_minutes: Number(estimatedMinutes),
        due_date: dueDate,
      });

      setErrors(response.ok ? {} : response.errors);
      if (response.ok) {
        setFeedback({ type: "success", message: "Tarefa salva com sucesso!" });
        setType("");
        setDificulty("");
        setSubject("");
        setTitle("");
        setDescription("");
        setTheme("");
        setEstimatedMinutes("");
        setDueDate("");
      } else if (Object.keys(response.errors).length === 0) {
        setFeedback({
          type: "error",
          message: "Não foi possível salvar a tarefa. Tente novamente.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Não foi possível salvar a tarefa. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 border-x px-10 w-full max-w-md">
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="title">Título</FieldLabel>
          <Input
            id="title"
            placeholder="Título da tarefa"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-invalid={!!errors.title}
          />
          <FieldError errors={errors.title?.map((message) => ({ message }))} />
        </Field>

        <Field data-invalid={!!errors.theme}>
          <FieldLabel htmlFor="theme">Tema:</FieldLabel>
          <Textarea
            id="theme"
            placeholder="Descreva o tema do conteúdo a ser estudado"
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            aria-invalid={!!errors.theme}
          />
          <FieldError errors={errors.theme?.map((message) => ({ message }))} />
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="description">Descrição</FieldLabel>
          <Textarea
            id="description"
            maxLength={2000}
            placeholder="Descreva a tarefa"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            aria-invalid={!!errors.description}
          />
          <FieldError
            errors={errors.description?.map((message) => ({ message }))}
          />
        </Field>

        <Field data-invalid={!!errors.type}>
          <FieldLabel htmlFor="type">Tipo</FieldLabel>
          <Select
            items={taskTypeItems}
            value={type === "" ? null : type}
            onValueChange={handleSelectType}
          >
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {taskTypeItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError errors={errors.type?.map((message) => ({ message }))} />
        </Field>

        <Field data-invalid={!!errors.subject}>
          <FieldLabel htmlFor="subject">Matéria</FieldLabel>
          <Select
            items={taskSubjectItems}
            value={subject === "" ? null : subject}
            onValueChange={handleSelectSubject}
          >
            <SelectTrigger id="subject" className="w-full">
              <SelectValue placeholder="Selecione uma matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {taskSubjectItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError
            errors={errors.subject?.map((message) => ({ message }))}
          />
        </Field>

        <Field data-invalid={!!errors.dificulty}>
          <FieldLabel htmlFor="dificulty">Dificuldade</FieldLabel>
          <Select
            items={taskDificultyItems}
            value={dificulty === "" ? null : dificulty}
            onValueChange={handleSelectDificulty}
          >
            <SelectTrigger id="dificulty" className="w-full">
              <SelectValue placeholder="Selecione a dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {taskDificultyItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError
            errors={errors.dificulty?.map((message) => ({ message }))}
          />
        </Field>

        <Field data-invalid={!!errors.estimated_minutes}>
          <FieldLabel htmlFor="estimated_minutes">
            Estimativa de tempo (minutos)
          </FieldLabel>
          <Input
            id="estimated_minutes"
            type="number"
            min={1}
            placeholder="60"
            value={estimatedMinutes}
            onChange={(event) => setEstimatedMinutes(event.target.value)}
            aria-invalid={!!errors.estimated_minutes}
          />
          <FieldError
            errors={errors.estimated_minutes?.map((message) => ({ message }))}
          />
        </Field>

        <Field data-invalid={!!errors.due_date}>
          <FieldLabel htmlFor="due_date">Data limite</FieldLabel>
          <Input
            id="due_date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            aria-invalid={!!errors.due_date}
          />
          <FieldError
            errors={errors.due_date?.map((message) => ({ message }))}
          />
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
