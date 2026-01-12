import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  isRag: boolean;
  modelProvider: string;
  _hasHydrated: boolean; // hydration 상태 추적
};

type Action = {
  setModelProvider: (model: string) => void;
  setIsRag: (value: boolean) => void;
  getRequestData: () => Pick<State, "modelProvider" | "isRag">;
  setHasHydrated: (state: boolean) => void;
};

export const useConversationSettings = create<State & Action>()(
  persist(
    (set, get) => ({
      isRag: false,
      modelProvider: "gemini-2.0-flash",
      _hasHydrated: false,
      setModelProvider: (model: string) => set({ modelProvider: model }),
      setIsRag: (value: boolean) => set({ isRag: value }),
      getRequestData: () => {
        return {
          modelProvider: get().modelProvider,
          isRag: get().isRag,
        };
      },
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: "conversation-settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isRag: state.isRag,
        modelProvider: state.modelProvider,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
