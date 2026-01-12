# File Upload 기능 추가 작업

`src\app\(main)\conversation\components\chat-window.tsx`와 `src\app\(main)\conversation\components\prompt-input.tsx`에 파일 업로드 기능 추가해주세요.

**요구 사항**:
1. 우선 `handleSubmit` 부분은 수정하지 말아주세요.
2. 업로드 가능한 파일 형식은 우선 .txt 파일과 image만 가능하게 해주세요.
3. 한번에 한 개의 파일만 업로드를 할 수 있고, 파일 업로드 버튼을 여러 번 클릭해 여러 개의 파일을 업로드 가능하게 해주세요.
4. 최대 이미지 개수는 10개로 설정해주세요.
5. 선택된 파일은 `PromptInput`에서 textarea 위에 표시하고, .txt 파일의 경우 file 이름 및 svg로 .txt 파일임을 나타내는 이미지 그려주세요. 그리고 우상단에 x 버튼을 추가해서 클릭 시 해당 파일 제거되게 구현해주세요.
6. 이미지의 경우 `URL.createObjectURL()` 사용해서 임시 이미지 보여주세요. 우상단에 x 버튼을 추가해서 클릭 시 해당 파일 제거되게 구현해주세요.