import { auth, currentUser } from "@clerk/nextjs/server";
import Header from "../layout/PageHeader";
import ChatWindow from "./components/ChatWindow";

export default async function ChatPage() {
  await auth.protect();
  const user = await currentUser();
  if (!user) return null;

  return (
    <div className="w-full">
      <Header
        title="Chat"
        subtitle="Tire dúvidas sobre suas tarefas e matérias com o assistente do planner."
      />
      <ChatWindow />
    </div>
  );
}
