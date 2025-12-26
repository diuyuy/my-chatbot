import { RESPONSE_STATUS } from "@/constants/response-status";
import {
  ConversationSchema,
  ErrorResponseSchema,
  ValidationErrorSchema,
} from "@/schemas/zod-schemas";
import { getSuccessResponse } from "@/server/common/utils/get-success-response";
import { zodValidationHook } from "@/server/common/utils/zod-validation-hook";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const conversationRoute = new OpenAPIHono();

const findAllRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ConversationSchema,
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
            code: RESPONSE_STATUS.NOT_FOUND.code,
            message: RESPONSE_STATUS.NOT_FOUND.message,
          },
        },
      },
      description: "",
    },
  },
});

conversationRoute.openapi(
  findAllRoute,
  (c) => {
    return c.json(
      getSuccessResponse(RESPONSE_STATUS.OK, { title: "sfsd" }),
      200
    );
  },
  zodValidationHook
);

const findByIdRoute = createRoute({
  method: "get",
  path: "/conversations/:id",
  request: {
    params: z.object({
      id: z.uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ConversationSchema,
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
  },
});

export default conversationRoute;
