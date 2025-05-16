"use client";
export default function Home() {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_ID!;
  const redirectUri = "http://localhost:3000/callback/github";

  const handleLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user&prompt=consent`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-8">OAuth Only Project</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with Github
      </button>
    </div>
  );
}