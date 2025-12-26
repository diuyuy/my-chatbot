import { ResponseStatus } from "@/types/types";
import { Context } from "hono";

export const toErrorMessage = (
  c: Context,
  { status, message }: ResponseStatus
) => {
  return c.json(
    {
      success: false,
      code: status,
      message,
    },
    status
  );
};
