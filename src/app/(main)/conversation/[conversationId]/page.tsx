import { findAllMessages } from "@/server/features/messages/message.service";
import ChatWindow from "../components/chat-window";

type Props = {
  params: Promise<{ conversationId: string }>;
};

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = await params;
  console.log("🚀 ~ ChatPage ~ conversationId:", conversationId);
  const initialMessages = await findAllMessages(conversationId, {
    limit: 20,
    cursor: undefined,
  });
  console.log(
    "🚀 ~ ConversationPage ~ initialMessages:",
    JSON.stringify(initialMessages.items, null, 2)
  );

  return (
    <div className="w-full min-h-screen">
      <ChatWindow
        conversationId={conversationId}
        initalMessages={initialMessages.items}
      />
    </div>
  );
}
