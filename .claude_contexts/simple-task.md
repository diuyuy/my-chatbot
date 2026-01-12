# useIsCreatingStore 리팩토링

`src\hooks\use-is-creating-new-conversation.ts` zustand store에서 `isRag`와 `modelProvider` 및 이 속성들을 조회, 수정하는 메서드들을 별도의 zustand store로 분리해주세요.

또한 `src\app\(main)\conversation\page.tsx`와 `src\app\(main)\conversation\components\chat-window.tsx`에서 `useIsCreatingNewConversation` 사용하고 있는데, 이 부분도 수정사항 반영해주세요.