import { create } from "zustand";

type State = {
  isCreating: boolean;
  message: string | null;
  files: File[];
};

type Action = {
  setIsCreating: (message: string, files: File[]) => void;
  setIsCreated: () => void;
  consumeMessage: () => string | null;
  consumeFiles: () => File[];
};

export const useIsCreatingNewConversation = create<State & Action>(
  (set, get) => ({
    isCreating: false,
    message: null,
    files: [],
    setIsCreating: (message: string, files: File[]) =>
      set({ isCreating: true, message, files }),
    setIsCreated: () =>
      set({
        isCreating: false,
        message: null,
        files: [],
      }),
    consumeMessage: () => {
      const msg = get().message;
      if (msg) {
        set({ message: null });
      }
      return msg;
    },
    consumeFiles: () => {
      const files = get().files;
      if (files) {
        set({ files: [] });
      }
      return files;
    },
  })
);
