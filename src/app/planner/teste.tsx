//  Sessões de estudo já marcadas:
//     {json.dumps(already_booked_dates, ensure_ascii=False, indent=2)}

//     already_booked_sessions = StudySession.objects.filter(start_time__gte = start_date, end_time__lte = end_date)

//     already_booked_dates = [
//         {
//             "start_time": item.start_time.isoformat(),
//             "end_time": item.end_time.isoformat(),
//         }
//         for item in already_booked_sessions
//     ]

//     response = client.chat.completions.create(
//         model="gpt-4o-mini",
//         messages=[{"role": "user", "content": prompt}],
//     )

//     content = response.choices[0].message.content

//     if "```json" in content:
//         content = content.split("```json")[1].split("```")[0].strip()
//     elif "```" in content:
//         content = content.split("```")[1].split("```")[0].strip()

//     from json.decoder import JSONDecodeError
//     import re

//     try:
//         data = json.loads(content)
//     except JSONDecodeError as e:
//         # Save raw AI output for debugging
//         output_dir = Path(settings.BASE_DIR) / "ai_outputs"
//         output_dir.mkdir(parents=True, exist_ok=True)
//         raw_filename = f"study_plan_{student.id}_{start_date}_{end_date}_raw.txt"
//         raw_path = output_dir / raw_filename
//         raw_path.write_text(content, encoding="utf-8")
//         print(f"AI returned invalid JSON; raw response saved to {raw_path}: {e}")

//         # Try a simple cleanup: remove trailing commas before ] or }
//         cleaned = re.sub(r",\s*([\]}])", r"\1", content)
//         try:
//             data = json.loads(cleaned)
//             print("Recovered JSON after basic cleanup.")
//         except JSONDecodeError:
//             # If still invalid, re-raise with context to help debugging
//             raise

//     # Save AI response to a JSON file for debugging/records
//     output_dir = Path(settings.BASE_DIR) / "ai_outputs"
//     output_dir.mkdir(parents=True, exist_ok=True)
//     filename = f"study_plan_{student.id}_{start_date}_{end_date}.json"
//     file_path = output_dir / filename
//     with file_path.open("w", encoding="utf-8") as f:
//         json.dump(data, f, ensure_ascii=False, indent=2)
//     print(f"Saved AI study plan to {file_path}")

//     for recommendation in data.get("summary", {}).get("study_recommendations", []):
//         task_id_raw = recommendation.get("task_id")
//         try:
//             task_id = int(task_id_raw)
//         except (TypeError, ValueError):
//             continue

//         task = Task.objects.filter(id=task_id, student=student).first()
//         if not task:
//             continue

//         StudyPlan.objects.create(
//             student=student,
//             task=task,
//             title=recommendation.get("title", ""),
//             overview=recommendation.get("overview", ""),
//             prerequisites=recommendation.get("prerequisites") or None,
//             topics_to_study=recommendation.get("topics_to_study") or None,
//             common_mistakes=recommendation.get("common_mistakes") or None,
//             study_tips=recommendation.get("study_tips") or None,
//         )

//     for session_data in data.get("sessions", []):

//         task_id_raw = session_data.get("task_id")
//         try:
//             task_id = int(task_id_raw)
//         except (TypeError, ValueError):
//             continue

//         task = Task.objects.filter(id=task_id, student=student).first()
//         if not task:
//             continue

//         study_plan = StudyPlan.objects.filter(student=student, task=task).first()
//         if not study_plan:
//             continue

//         StudySession.objects.create(
//             student=student,
//             study_plan=study_plan,
//             task=task,
//             title=session_data.get("title", ""),
//             start_time=datetime.fromisoformat(session_data.get("start_time")),
//             end_time=datetime.fromisoformat(session_data.get("end_time")),
//             ai_reason=session_data.get("reason", ""),
//         )

//     for task in tasks:
//         task.status = Task.Status.GERADO
//         task.save()

//     return None
