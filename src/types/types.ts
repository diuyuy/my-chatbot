import { ContentfulStatusCode } from "hono/utils/http-status";

export type PaginationOption<T> = {
  cursor: T | null;
  size: number;
};

export type ResponseStatus = {
  status: ContentfulStatusCode;
  code: string;
  message: string;
};
