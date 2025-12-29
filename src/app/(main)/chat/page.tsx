import { PromptInput } from "./components/prompt-input";

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-full px-16">
        <PromptInput />
      </div>
    </div>
  );
}
