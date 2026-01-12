import { GithubLoginButton } from "./components/github-login-button";
import { GoogleLoginButton } from "./components/google-login-button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-lg shadow-lg p-8">
          {/* 로고/타이틀 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">My Agent</h1>
            <p className="text-muted-foreground mt-2">AI 대화를 시작하세요</p>
          </div>

          {/* 소셜 로그인 버튼들 */}
          <div className="space-y-3">
            <GoogleLoginButton />
            <GithubLoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}
