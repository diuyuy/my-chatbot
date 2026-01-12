import { create } from "zustand";

type State = {
  isRag: boolean;
  modelProvider: string;
};

type Action = {
  setModelProvider: (model: string) => void;
  setIsRag: (value: boolean) => void;
  getRequestData: () => Pick<State, "modelProvider" | "isRag">;
};

export const useConversationSettings = create<State & Action>((set, get) => ({
  isRag: false,
  modelProvider: "gemini-2.0-flash",
  setModelProvider: (model: string) => set({ modelProvider: model }),
  setIsRag: (value: boolean) => set({ isRag: value }),
  getRequestData: () => {
    return {
      modelProvider: get().modelProvider,
      isRag: get().isRag,
    };
  },
}));
