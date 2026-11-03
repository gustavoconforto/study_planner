import { auth } from "@clerk/nextjs/server";
import Header from "../layout/PageHeader";
import ChatWindow from "./components/ChatWindow";

export default async function ChatPage() {
  await auth.protect();

  return (
    <div>
      <Header
        title="Chat"
        subtitle="Tire dúvidas sobre suas tarefas e matérias com o assistente do planner."
      />
      <ChatWindow />
    </div>
  );
}
