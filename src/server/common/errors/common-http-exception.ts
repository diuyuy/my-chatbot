import { ResponseStatus } from "@/types/types";
import { HTTPException } from "hono/http-exception";

export class CommonHttpException extends HTTPException {
  code: string;

  constructor({ status, code, message }: ResponseStatus) {
    super(status, { message });
    this.code = code;
  }
}
