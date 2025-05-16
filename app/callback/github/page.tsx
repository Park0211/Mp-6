"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function GithubCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUserInfo() {
      if (!code) return;

      try {
        // 1. code --> token
        const res = await fetch("/api/github/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const { access_token } = await res.json();

        if (!access_token) {
          router.push("/");
          return;
        }

        // 2. token --> user info
        const resUser = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const userData = await resUser.json();
        setUser(userData);
      } catch (error) {
        console.error("OAuth error:", error);
        router.push("/");
      }
    }

    fetchUserInfo();
  }, [code, router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-100">
      <img
        src={user.avatar_url}
        alt="User Avatar"
        className="w-32 h-32 rounded-full mb-4"
      />
      <h2 className="text-2xl font-bold mb-4">{user.login}</h2>
      <p className="text-gray-600 text-lg">Signed with GitHub</p>
    </div>
  );
}