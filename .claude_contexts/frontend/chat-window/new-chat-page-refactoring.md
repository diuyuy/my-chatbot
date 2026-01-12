# NewChatPage 리팩토링 작업

`src\app\(main)\conversation\page.tsx`를 다음 요구사항에 맞게 리팩토링 해주세요.

**요구사항**: 
1. `src\app\(main)\conversation\hooks\use-prompt-input.ts`사용해서 필요한 Props를 `src\app\(main)\conversation\components\prompt-input.tsx` 컴포넌트로 전달해주세요.
2. `src\hooks\use-is-creating-new-conversation.ts`에 `message` 뿐만 아니라 `files` 도 같이 관리하게 구현해주세요.
3. `src\app\(main)\conversation\components\chat-window.tsx`에서 `consumeFiles()`를 통해 useEffect() 내부에서 files를 가져오도록 구현해주세요. 우선 files 전송 로직은 따로 구현하지 말아주세요.  