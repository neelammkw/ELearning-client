// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    provider?: string;
  }
}
