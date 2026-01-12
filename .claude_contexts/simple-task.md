# AppSidebarFooter 구현 작업

`src\components\app-sidebar\app-sidebar-footer.tsx`에 다음과 같은 요구사항으로 기능 추가해주세요.

**요구사항**:
1. `src\components\ui\dropdown-menu.tsx` 사용해서 `SidebarMenuButton` 클릭 시 DropdownMenu open 되게 구현해주세요.
2. `DropdownMenu` 첫 번째 버튼: 테마 설정 버튼
  - `DropdownMenuSub` 사용해서 라이트, 다크, 시스템 3가지 옵션 선택 가능하게 해주세요.
3. `DropdownMenu` 두 번째 버튼: 로그아웃 버튼
  - `src\lib\auth-client.ts` 사용해서 `authClient.signOut()` 통해 로그아웃 하게 하고, 로그아웃 시, 로그인 페이지로 redirect 되게 해주세요.