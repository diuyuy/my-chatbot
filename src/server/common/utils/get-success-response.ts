import { ResponseStatus } from "@/types/types";

export const getSuccessResponse = <T>({ message }: ResponseStatus, data: T) => {
  return {
    success: true as const,
    message,
    data,
  };
};
