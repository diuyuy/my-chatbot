import { GithubLoginButton } from "./components/github-login-button";

export default function LoginPage() {
  return (
    <div className="container min-h-screen mx-auto px-4 py-8">
      <div className="h-full flex flex-col justify-center items-center">
        <GithubLoginButton />
      </div>
    </div>
  );
}
