import { db } from '@/src/db/db';
import json
import db
from datetime import datetime
from pathlib import Path

from django.conf import settings

from planner.models import Task, StudyPlan, StudySession
from disponibilidades.models import Availability

from openai import OpenAI


client = OpenAI(api_key=settings.OPENAI_API_KEY)

export async function get_tasks_from_user() {

}
def generate_ai_study_plan(student, start_date, end_date):
    tasks = Task.objects.filter(
        student=student,
        status__in=[Task.Status.AGUARDANDO],
        due_date__gte=start_date,
        due_date__lte=end_date,
    ).select_related("subject")

    availability = Availability.objects.filter(student=student)

    already_booked_sessions = StudySession.objects.filter(start_time__gte = start_date, end_time__lte = end_date)

    task_data = [
        {
            "id": task.id,
            "title": task.title,
            "subject": task.subject.name if task.subject else None,
            "description": task.description,
            "type": task.task_type,
            "difficulty": task.difficulty,
            "due_date": task.due_date.isoformat(),
            "estimated_minutes": task.estimated_minutes,
        }
        for task in tasks
    ]

    availability_data = [
        {
            "weekday": item.get_weekday_display(),
            "start_time": item.start_time.strftime("%H:%M"),
            "end_time": item.end_time.strftime("%H:%M"),
        }
        for item in availability
    ]

    already_booked_dates = [
        {
            "start_time": item.start_time.isoformat(),
            "end_time": item.end_time.isoformat(),
        }
        for item in already_booked_sessions
    ]

    prompt = f"""
    Você é um orientador acadêmico especializado em estudantes do ensino médio.

    Crie um plano de estudos realista entre {start_date} e {end_date}.

    Regras:
    - Priorize tarefas com prazos mais próximos.
    - Dedique mais tempo para tarefas classificadas como difíceis.
    - Não agende sessões fora dos horários disponíveis do aluno.
    - Divida tarefas longas em sessões menores.
    - Evite sessões superiores a 60 minutos.
    - Evite escolher Sábado e Domingo a não ser que não haja outra opção
    - Caso a matéria (subject) esteja ente as opções: Matemática, Física, Química, coloque no início da tarde.
    - Caso a matéria seja redação e você consiga identificar algum tema, passe, nas dicas (study_tips) alguns links de matéria de páginas que julgar interessante. Tente no mínimo duas referências
    - Considere revisões quando houver tempo disponível.
    - Procure marcar os horários em horários disponíveis. Procure os horários já ocopados para nao sobrepor as tarefas.
    - Retorne apenas JSON válido.
    - Para cada tarefa, analise o tema informado e forneça orientações de estudo.

    Tarefas:
    {json.dumps(task_data, ensure_ascii=False, indent=2)}

    Disponibilidade do aluno:
    {json.dumps(availability_data, ensure_ascii=False, indent=2)}

    Sessões de estudo já marcadas:
    {json.dumps(already_booked_dates, ensure_ascii=False, indent=2)}

    Retorne exatamente neste formato:

    {{
    "summary": {{
        "general_analysis": "Análise geral da carga de estudos e distribuição das tarefas.",
        "study_recommendations": [
        {{
            "task_id": 1,
            "title": "Plano Inclinado",
            "overview": "Resumo do tema e dos objetivos de aprendizagem.",
            "prerequisites": [
            "Leis de Newton",
            "Vetores",
            "Decomposição de forças"
            ],
            "topics_to_study": [
            "Força peso",
            "Força normal",
            "Atrito",
            "Componentes do peso",
            "Equilíbrio em planos inclinados"
            ],
            "common_mistakes": [
            "Confundir peso com força normal",
            "Errar a decomposição vetorial"
            ],
            "study_tips": [
            "Resolver exercícios progressivos",
            "Desenhar diagramas de forças"
            ]
        }}
        ]
    }},
    "sessions": [
        {{
        "task_id": 1,
        "title": "Plano Inclinado",
        "start_time": "YYYY-MM-DDTHH:MM:SS",
        "end_time": "YYYY-MM-DDTHH:MM:SS",
        "reason": "Esta sessão foi agendada devido à proximidade do prazo e à alta dificuldade do conteúdo."
        }}
    ]
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    content = response.choices[0].message.content
    
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()

    
    from json.decoder import JSONDecodeError
    import re

    try:
        data = json.loads(content)
    except JSONDecodeError as e:
        # Save raw AI output for debugging
        output_dir = Path(settings.BASE_DIR) / "ai_outputs"
        output_dir.mkdir(parents=True, exist_ok=True)
        raw_filename = f"study_plan_{student.id}_{start_date}_{end_date}_raw.txt"
        raw_path = output_dir / raw_filename
        raw_path.write_text(content, encoding="utf-8")
        print(f"AI returned invalid JSON; raw response saved to {raw_path}: {e}")

        # Try a simple cleanup: remove trailing commas before ] or }
        cleaned = re.sub(r",\s*([\]}])", r"\1", content)
        try:
            data = json.loads(cleaned)
            print("Recovered JSON after basic cleanup.")
        except JSONDecodeError:
            # If still invalid, re-raise with context to help debugging
            raise

    # Save AI response to a JSON file for debugging/records
    output_dir = Path(settings.BASE_DIR) / "ai_outputs"
    output_dir.mkdir(parents=True, exist_ok=True)
    filename = f"study_plan_{student.id}_{start_date}_{end_date}.json"
    file_path = output_dir / filename
    with file_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Saved AI study plan to {file_path}")

    for recommendation in data.get("summary", {}).get("study_recommendations", []):
        task_id_raw = recommendation.get("task_id")
        try:
            task_id = int(task_id_raw)
        except (TypeError, ValueError):
            continue

        task = Task.objects.filter(id=task_id, student=student).first()
        if not task:
            continue

        StudyPlan.objects.create(
            student=student,
            task=task,
            title=recommendation.get("title", ""),
            overview=recommendation.get("overview", ""),
            prerequisites=recommendation.get("prerequisites") or None,
            topics_to_study=recommendation.get("topics_to_study") or None,
            common_mistakes=recommendation.get("common_mistakes") or None,
            study_tips=recommendation.get("study_tips") or None,
        )



    for session_data in data.get("sessions", []):

        task_id_raw = session_data.get("task_id")
        try:
            task_id = int(task_id_raw)
        except (TypeError, ValueError):
            continue

        task = Task.objects.filter(id=task_id, student=student).first()
        if not task:
            continue

        study_plan = StudyPlan.objects.filter(student=student, task=task).first()
        if not study_plan:
            continue

        StudySession.objects.create(
            student=student,
            study_plan=study_plan,
            task=task,
            title=session_data.get("title", ""),
            start_time=datetime.fromisoformat(session_data.get("start_time")),
            end_time=datetime.fromisoformat(session_data.get("end_time")),
            ai_reason=session_data.get("reason", ""),
        )

    for task in tasks:
        task.status = Task.Status.GERADO
        task.save()

    return None