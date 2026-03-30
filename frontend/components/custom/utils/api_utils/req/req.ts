import axios from "axios";
import { createClient } from "./client";
import { env } from "next-runtime-env";

export async function googleSignIn(credential: string, role?: string) {
  const BASE_URL = env("NEXT_PUBLIC_BASE_URL")
  const AUTHPORT = env("NEXT_PUBLIC_AUTH_PORT") 
  const client = createClient(BASE_URL || "http://localhost");
  const res = await client.post(`${BASE_URL}:${AUTHPORT}/auth/api/auth/login`, {
    token_id: credential,
    role,
  });
  const data = await res.data;

  // return data;

  return data as {
    token: string;
    role: string;
    email: string;
    name: string;
    id: string;
  };
}
