import { geminiModels, openaiModels } from "@/constants/model-providers";
import { RESPONSE_STATUS } from "@/constants/response-status";
import { CommonHttpException } from "@/server/common/errors/common-http-exception";
import { DocsLanguage } from "@/types/types";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {
  convertToModelMessages,
  createIdGenerator,
  embed,
  embedMany,
  InvalidToolInputError,
  NoSuchToolError,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { MyUIMessage } from "./ai.schemas";
import { SYSTEM_PROMPTS } from "./system-prompts";
import { toolSet } from "./too-set";

const getModel = (modelProvider: string) => {
  if (geminiModels.includes(modelProvider)) {
    return google(modelProvider);
  }

  if (openaiModels.includes(modelProvider)) {
    return openai(modelProvider);
  }

  throw new CommonHttpException(RESPONSE_STATUS.INVALID_REQUEST_FORMAT);
};

const embeddingModel = openai.embeddingModel("text-embedding-3-small");

export const generateUIMessageStreamResponse = async ({
  conversationId,
  messages,
  modelProvider,
  onFinish,
  context,
}: {
  conversationId: string;
  messages: MyUIMessage[];
  modelProvider: string;
  onFinish: (response: { messages: MyUIMessage[] }) => void;
  context?: string;
}) => {
  return streamText({
    model: getModel(modelProvider),
    system: SYSTEM_PROMPTS.getSystemPrompt(context),
    messages: await convertToModelMessages(messages),
    experimental_transform: smoothStream(),
    tools: toolSet,
    stopWhen: stepCountIs(5),
  }).toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: myIdGenerator,
    messageMetadata: () => ({
      modelProvider,
      conversationId,
    }),
    onFinish,
    onError: (error) => {
      if (NoSuchToolError.isInstance(error)) {
        return "The model tried to call a unknown tool.";
      } else if (InvalidToolInputError.isInstance(error)) {
        return "The model called a tool with invalid inputs.";
      } else if (error instanceof Error) {
        console.log(error.message);
        return error.message;
      } else {
        return "An unknown error occurred.";
      }
    },
  });
};

export const generateTitle = (message: string) => {
  return message.length > 20 ? `${message.substring(0, 20)}...` : message;
};

const myIdGenerator = createIdGenerator({
  prefix: "msg",
  size: 16,
});

export const generateEmbeddings = async (
  value: string,
  docsLanguage?: DocsLanguage
) => {
  const chunks = await generateChunks(value, docsLanguage);

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string) => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

const generateChunks = async (value: string, docsLanguage?: DocsLanguage) => {
  if (docsLanguage && docsLanguage !== "none") {
    const splitter = RecursiveCharacterTextSplitter.fromLanguage(docsLanguage);

    return splitter.splitText(value);
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 80,
    separators: [
      "\n\n",
      "\n",
      " ",
      ".",
      ",",
      "\u200b", // Zero-width space
      "\uff0c", // Fullwidth comma
      "\u3001", // Ideographic comma
      "\uff0e", // Fullwidth full stop
      "\u3002", // Ideographic stop
      "",
    ],
  });
  return splitter.splitText(value);
};
