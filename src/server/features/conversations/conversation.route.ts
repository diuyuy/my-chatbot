import { RESPONSE_STATUS } from "@/constants/response-status";
import {
  ErrorResponseSchema,
  SuccessReponseSchema,
  ValidationErrorSchema,
} from "@/schemas/common.schemas";
import { PaginationConversationSchema } from "@/schemas/conversation.schema";
import { zValidator } from "@hono/zod-validator";

import { UserMessageSchema } from "@/schemas/message.schema";
import { sessionMiddleware } from "@/server/common/middlewares/session.middleware";
import { Env } from "@/server/common/types/types";
import { createSuccessResponse } from "@/server/common/utils/response-utils";
import { zodValidationHook } from "@/server/common/utils/zod-validation-hook";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  createConversation,
  findAllConversations,
  removeConversation,
} from "./conversation.service";

const conversationRoute = new OpenAPIHono<Env>();

conversationRoute.use(sessionMiddleware);

const findAllRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: z.object({
      cursor: z.string().optional(),
      limit: z.coerce.number().min(1),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema.extend({
            data: PaginationConversationSchema,
          }),
        },
      },
      description: "Get all conversations",
    },
    400: {
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
      description: "요청 형식 오류",
    },
  },
});

conversationRoute.openapi(findAllRoute, async (c) => {
  const { cursor, limit } = c.req.valid("query");
  const user = c.get("user");
  const conversations = await findAllConversations(user.id, {
    cursor,
    limit: limit,
  });

  return c.json(createSuccessResponse(RESPONSE_STATUS.OK, conversations), 200);
});

conversationRoute.openAPIRegistry.registerPath({
  path: "/",
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UserMessageSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "text/event-stream": {
          schema: z.string(),
        },
      },
      description: "성공 응답(텍스트 스트림)",
    },
    400: {
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
      description: "요청 형식 오류",
    },
  },
});

conversationRoute.post(
  "/",
  zValidator("json", UserMessageSchema, zodValidationHook),
  async (c) => {
    const createConversationDto = c.req.valid("json");
    const user = c.get("user");

    return createConversation(user.id, createConversationDto);
  }
);

conversationRoute.openAPIRegistry.registerPath({
  path: "/:conversationId",
  method: "post",
  request: {
    params: z.object({
      conversationId: z.uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.string(),
        },
      },
      description: "",
    },
  },
});

const deleteConversationRoute = createRoute({
  method: "delete",
  path: "/:conversationId",
  request: {
    params: z.object({
      conversationId: z.uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema.extend({
            data: z.object({
              conversationId: z.string(),
            }),
          }),
        },
      },
      description: "",
    },
    400: {
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
      description: "요청 형식 오류",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
          example: {
            success: false,
            code: RESPONSE_STATUS.CONVERSATION_NOT_FOUND.code,
            message: RESPONSE_STATUS.CONVERSATION_NOT_FOUND.message,
          },
        },
      },
      description: "",
    },
  },
});

conversationRoute.openapi(
  deleteConversationRoute,
  async (c) => {
    const { conversationId } = c.req.valid("param");
    const user = c.get("user");

    const result = await removeConversation(user.id, conversationId);

    return c.json(createSuccessResponse(RESPONSE_STATUS.OK, result), 200);
  },
  zodValidationHook
);

export default conversationRoute;
