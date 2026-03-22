import axios from "axios";
import { createClient } from "./client";

export async function googleSignIn(credential: string, role?: string) {
  const res = await axios.post("http://localhost:9084/auth/api/auth/login", {
    token_id: credential,
    role,
  });
  const data = await res.data;

  // return data;
  console.log(data);

  return data as {
    token: string;
    role: string;
    email: string;
    name: string;
    id: string;
  };
}
