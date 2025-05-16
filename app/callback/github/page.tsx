"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// type "any" is not allowed
type User = {
  avatar_url: string;
  login: string;
}

// export default function GithubCallback({searParams} : {searchParams: code: string})
// above code is not available (Promise is required)
// this page is client-side page, so async-Promise cannot be used

// useSearchParams should be wrappend in a suspense boundary but we haven't learnt it yet.
export default function GithubCallback() {
  const router = useRouter();
  // code where type "User" is in used
  const [user, setUser] = useState<User | null>(null);
  const [code, setCode] = useState<string | null>(null);

  // this is the right way to get parameters from url without using searchParams
  useEffect(() =>{
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tempCode = params.get("code")
      setCode(tempCode)
    }
  }, [])

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
      <Image src={user.avatar_url} width={80} height={80} alt="User Avatar" className="rounded-full mb-4" />
      <h2 className="text-2xl font-bold mb-4">{user.login}</h2>
      <p className="text-gray-600 text-lg">Signed with GitHub</p>
    </div>
  );
}