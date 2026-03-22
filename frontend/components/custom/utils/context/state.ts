import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const userAtom = atom<{
  id: string;
  email: string;
  role: string;
  name: string;
} | null>(null);

export const tokenAtom = atomWithStorage<string | null>("csc_480_token", null);
