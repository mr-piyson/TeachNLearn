import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const createContext = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return {
      session,
    };
  } catch (error) {
    return {
      session: null,
    };
  }
};

export type Context = Awaited<ReturnType<typeof createContext>>;
