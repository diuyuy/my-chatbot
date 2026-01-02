"use client";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ROUTER_PATH } from "@/constants/router-path";
import { MyUIMessage } from "@/server/features/ai/ai.schemas";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { PromptInput } from "./prompt-input";

type Props = {
  conversationId?: string;
  initalMessages?: MyUIMessage[];
};
export default function ChatWindow({ conversationId, initalMessages }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages } = useChat({
    id: conversationId,
    messages: initalMessages,
    transport: new DefaultChatTransport({
      api: "/api/conversations",
      prepareSendMessagesRequest: ({ messages, id }) => {
        return {
          body: {
            message: messages[messages.length - 1],
            id,
            modelProvider: "gemini",
            conversationId,
          },
        };
      },
    }),
    onFinish: ({ message }) => {
      const newConversationId = message.metadata?.conversationId;

      if (newConversationId) {
        window.history.pushState(
          null,
          "",
          `${ROUTER_PATH.CONVERSATION}/${newConversationId}`
        );
      }
      router.refresh();
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  useEffect(() => {
    if (pathname === ROUTER_PATH.CONVERSATION) {
      setMessages([]);
    }
  }, [pathname, setMessages]);

  return (
    <div className="w-full mx-auto h-screen px-2 flex flex-col">
      <div className="flex-1 mx-auto overflow-y-auto no-scrollbar p-6 space-y-8">
        {messages.length === 0 ? (
          <div className="my-auto text-center text-3xl font-bold">
            채팅을 입력해보세요.
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id}>
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="w-md border-2 p-2 border-gray-400 rounded-md">
                    {message.parts
                      .map((part) => (part.type === "text" ? part.text : ""))
                      .join("")}
                  </div>
                </div>
              ) : (
                <MarkdownRenderer>
                  {message.parts
                    .map((part) => (part.type === "text" ? part.text : ""))
                    .join("")}
                </MarkdownRenderer>
              )}
            </div>
          ))
        )}
      </div>
      <div className="mx-4 mb-8 mt-4 py-3">
        <form onSubmit={handleSubmit}>
          <PromptInput value={input} setValue={setInput} />
        </form>
      </div>
    </div>
  );
}
