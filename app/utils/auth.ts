// utils/auth.ts
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

type LogoutMutation = () => Promise<void>;

export const handleLogout = async (
  logoutMutation: LogoutMutation,
  refetch?: () => Promise<void>,
): Promise<void> => {
  try {
    await signOut({ redirect: false });
    await logoutMutation();
    toast.success("Logged out successfully");

    if (refetch) {
      await refetch();
    }

    window.location.href = "/";
  } catch (error: unknown) {
    console.error("Logout error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to logout");
  }
};
