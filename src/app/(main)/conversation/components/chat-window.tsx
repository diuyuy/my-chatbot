"use client";

import { deleteMessage } from "@/client-services/message.api";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConversationSettings } from "@/hooks/use-conversation-settings";
import { useIsCreatingNewConversation } from "@/hooks/use-is-creating-new-conversation";
import { DeleteMessagesDto } from "@/schemas/message.schema";
import { MyUIMessage } from "@/server/features/ai/ai.schemas";
import { Copy, RefreshCw } from "lucide-react";
import { FormEvent, useEffect } from "react";
import { toast } from "sonner";
import { convertToFileList } from "../../../../lib/utils";
import { useMyChat } from "../hooks/use-my-chat";
import { usePromptInput } from "../hooks/use-prompt-input";
import { PromptInput } from "./prompt-input";

type Props = {
  conversationId: string;
  initialMessages?: MyUIMessage[];
};
export default function ChatWindow({ conversationId, initialMessages }: Props) {
  const { consumeMessage, consumeFiles } = useIsCreatingNewConversation();
  const { getRequestData, modelProvider, isRag } = useConversationSettings();

  const promptInput = usePromptInput();

  const { messages, sendMessage, status, regenerate, stop } = useMyChat(
    conversationId,
    initialMessages
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (promptInput.value.trim()) {
      sendMessage(
        {
          text: promptInput.value.trim(),
          files:
            promptInput.files.length > 0
              ? convertToFileList(promptInput.files)
              : undefined,
        },
        {
          body: {
            modelProvider,
            isRag,
          },
        }
      );
      promptInput.clearState();
    }
  };

  const handleRegeneration = async (deleteMessagesDto: DeleteMessagesDto) => {
    try {
      await deleteMessage(deleteMessagesDto);
      regenerate({ messageId: deleteMessagesDto.aiMessageId });
    } catch {
      toast.error("예상치 못한 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await window.navigator.clipboard.writeText(text);
      toast.success("클립보드에 복사되었습니다.", {
        duration: 1000,
      });
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  useEffect(() => {
    const msg = consumeMessage();
    const files = consumeFiles();
    if (msg) {
      sendMessage(
        {
          text: msg,
          files: files.length > 0 ? convertToFileList(files) : undefined,
        },
        {
          body: getRequestData(),
        }
      );
    }
  }, [consumeMessage, consumeFiles, getRequestData, sendMessage]);

  return (
    <div className="w-full mx-auto h-screen px-2 flex flex-col">
      <div className="flex-1 w-72 md:w-3xl mx-auto overflow-y-auto no-scrollbar p-6 space-y-8">
        {messages.map((message, index) => {
          // 3. 현재 메시지가 마지막인지 확인
          const isLastMessage = index === messages.length - 1;
          // 4. 로딩 상태 조건 정의 (마지막 메시지이고, 상태가 ready가 아닐 때)
          const isAiLoading =
            message.role !== "user" && isLastMessage && status === "submitted";

          return (
            <div key={message.id}>
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="space-y-2">
                    {message.parts.map((part, index) => {
                      if (part.type !== "file") {
                        return null;
                      }
                      if (part.mediaType.startsWith("image")) {
                        return (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={index} src={part.url} alt={part.filename} />
                        );
                      }

                      return null;
                    })}
                    <div className="max-w-md py-3 px-4 bg-card rounded-md">
                      {message.parts
                        .map((part) => (part.type === "text" ? part.text : ""))
                        .join("")}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    {message.parts.map((part, index) => {
                      if (part.type === "file") {
                        if (part.mediaType === "image") {
                          return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={index}
                              src={part.url}
                              alt={part.filename}
                            />
                          );
                        }
                      }

                      return null;
                    })}
                    <MarkdownRenderer>
                      {message.parts
                        .map((part) => (part.type === "text" ? part.text : ""))
                        .join("")}
                    </MarkdownRenderer>

                    {status === "error" && (
                      <div className="space-y-2">
                        <Separator />
                        <p className="italic text-muted-foreground">
                          대답 생성이 중지되었습니다.
                        </p>
                      </div>
                    )}

                    {/* 6. 완료되었을 때만 버튼 표시 (기존 로직 유지) */}
                    {!isAiLoading &&
                      (status === "ready" || status === "error") && (
                        <div className="flex gap-1 mt-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRegeneration({
                                    userMessageId: messages[index - 1].id,
                                    aiMessageId: message.id,
                                  })
                                }
                                className="h-8 px-2"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Regeneration</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCopy(
                                    message.parts
                                      .map((part) =>
                                        part.type === "text" ? part.text : ""
                                      )
                                      .join("")
                                  )
                                }
                                className="h-8 px-2"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Copy</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                  </div>
                </>
              )}
            </div>
          );
        })}
        {status === "submitted" && (
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <Spinner />
            <span className="text-xs">답변 생성 중...</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <PromptInput
          {...promptInput}
          stop={stop}
          isSending={status === "streaming" || status === "submitted"}
        />
      </form>
    </div>
  );
}
