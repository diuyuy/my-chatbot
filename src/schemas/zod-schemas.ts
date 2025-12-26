import { z } from "@hono/zod-openapi";

export const SuccessReponseSchema = z.object({
  success: z.literal(true),
  message: z.string().nonempty(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  code: z.string().nonempty(),
  message: z.string().nonempty(),
});

export const ValidationErrorSchema = z.object({
  success: z.literal(false).openapi({ example: false }),
  code: z
    .literal("REQUEST_VALIDATION_ERROR")
    .openapi({ example: "REQUEST_VALIDATION_ERROR" }),
  message: z
    .literal("유효하지 않은 요청 형식입니다.")
    .openapi({ example: "유효하지 않은 요청 형식입니다." }),
});

export const CreateConversationSchema = z.object({
  title: z.string(),
});

export const ConversationSchema = SuccessReponseSchema.extend({
  data: z.object({
    title: z.string(),
  }),
});
