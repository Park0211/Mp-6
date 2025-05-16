import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_ID!,
      client_secret: process.env.GITHUB_SECRET!,
      code,
    }),
  });

  const data = await res.json();
  return Response.json(data);
}