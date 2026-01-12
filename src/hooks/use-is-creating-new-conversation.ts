import { create } from "zustand";

type State = {
  isCreating: boolean;
  message: string | null;
};

type Action = {
  setIsCreating: (message: string) => void;
  setIsCreated: () => void;
  consumeMessage: () => string | null;
};

export const useIsCreatingNewConversation = create<State & Action>(
  (set, get) => ({
    isCreating: false,
    message: null,
    setIsCreating: (message: string) =>
      set({ isCreating: true, message }),
    setIsCreated: () =>
      set({
        isCreating: false,
        message: null,
      }),
    consumeMessage: () => {
      const msg = get().message;
      if (msg) {
        set({ message: null });
      }
      return msg;
    },
  })
);
