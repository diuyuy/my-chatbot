# PromptInput 컴포넌트 리팩토링

`src\app\(main)\conversation\components\prompt-input.tsx`를 다음 요구사항에 맞게 리팩토링 해주세요.

## 리팩토링 방안

### 커스텀 훅으로 상태 관리 분리

```typescript
// src\app\(main)\conversation\hooks\use-prompt-input.ts
export function usePromptInput() {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  return {
    value,
    setValue,
    files,
    setFiles,
  };
}

// 사용
function ChatWindow() {
  /* ... */
  const promptInput = usePromptInput();
  const [isSending, setIsSending] = useState(false);
  /* ... */

  return (
    <PromptInput 
      {...promptInput}
      isSending={isSending}
      stop={handleStop}
    />
  );
}
```

```ts
// PromptInput 컴포넌트
export function PromptInput({ value, setValue, files, setFiles, isSending, stop }: Props) {
  // 전역 상태는 컴포넌트 내부에서 직접 가져오기
  const { modelProvider, setModelProvider, isRag, setIsRag } = useChatStore();
  // ...
}
```