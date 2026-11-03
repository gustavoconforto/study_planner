import { auth } from "@clerk/nextjs/server";

// Every server action is a public endpoint: always take the user from the session, never from arguments.
export async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}
