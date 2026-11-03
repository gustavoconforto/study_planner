// One-off: fill the new user_id columns from the old email columns.
// Order: `npm run db:migrate`, deploy the new code, THEN run this (rows saved by the old code before
// the deploy have no user_id). Safe to run again: it only fills rows where user_id is still empty.
//   node --env-file=.env scripts/backfill-user-id.mjs
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const rows = await sql`
  select email from agendamentos where user_id is null and email is not null
  union select student_email from tasks where user_id is null and student_email is not null
  union select email from schedules where user_id is null and email is not null`;

for (const { email } of rows) {
  const res = await fetch(
    `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` } },
  );
  if (!res.ok) throw new Error(`Clerk lookup failed: ${res.status}`);
  const [user] = await res.json();
  if (!user) {
    console.warn(`No Clerk user for ${email}; rows left unchanged.`);
    continue;
  }
  await sql`update agendamentos set user_id = ${user.id} where email = ${email} and user_id is null`;
  await sql`update tasks set user_id = ${user.id} where student_email = ${email} and user_id is null`;
  await sql`update schedules set user_id = ${user.id} where email = ${email} and user_id is null`;
  console.log(`${email} -> ${user.id}`);
}
