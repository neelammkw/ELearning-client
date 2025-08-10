import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
// import redis from '@/utils/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(200).json({ success: true });
    }

    // Clear Redis cache for this user
    // await redis.del(`user:${session.user?.email}`);

    // Clear session cookies
    res.setHeader("Set-Cookie", [
      `next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`,
      `next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
