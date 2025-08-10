"use client";
import React, { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiLogOut } from "react-icons/fi";
import {
  HiOutlineUserCircle,
  HiOutlineLockClosed,
  HiOutlineBookOpen,
  HiOutlineShoppingBag,
  HiOutlineViewGrid,
} from "react-icons/hi";
import Link from "next/link";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useSelector } from "react-redux";

interface SideBarProfileProps {
  // user: any;
  active: number;
  setActive: (active: number) => void;
}

const SideBarProfile: FC<SideBarProfileProps> = ({ active, setActive }) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const [logoutMutation] = useLogoutMutation();
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useSession();
  const [logout, setLogout] = useState(false);

  const { refetch } = useLoadUserQuery(undefined, {
    skip: !logout,
  });

  const menuItems = [
    { id: 1, name: "My Account", icon: <HiOutlineUserCircle size={20} /> },
    { id: 2, name: "Change Password", icon: <HiOutlineLockClosed size={20} /> },
    { id: 3, name: "Enrolled Courses", icon: <HiOutlineBookOpen size={20} /> },
    {
      id: 4,
      name: "Purchase History",
      icon: <HiOutlineShoppingBag size={20} />,
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      await logoutMutation(undefined);
      toast.success("Logged out successfully");
      // Consider using router.push('/') instead of reload for better UX
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };
  useEffect(() => {
    if (logout) refetch();
  }, [logout, refetch]);

  return (
    <div className="w-full">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`w-full flex items-center px-3 py-4 cursor-pointer transition-colors duration-200 ${
            active === item.id
              ? currentTheme === "dark"
                ? "bg-slate-700"
                : "bg-gray-100"
              : currentTheme === "dark"
                ? "hover:bg-slate-700"
                : "hover:bg-gray-50"
          }`}
          onClick={() => setActive(item.id)}
        >
          <div
            className={`mr-3 ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {item.icon}
          </div>
          <h5
            className={`font-Poppins ${
              currentTheme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {item.name}
          </h5>
        </div>
      ))}

      {user?.role === "admin" && (
        <Link
          className={`w-full flex items-center px-3 py-4 cursor-pointer transition-colors duration-200 ${
            currentTheme === "dark" ? "hover:bg-slate-700" : "hover:bg-gray-50"
          }`}
          href="/admin"
        >
          <div className="mr-3 text-red-500">
            <HiOutlineViewGrid size={20} />
          </div>
          <h5 className="font-Poppins text-red-500">Admin Dashboard</h5>
        </Link>
      )}

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer transition-colors duration-200 ${
          currentTheme === "dark" ? "hover:bg-slate-700" : "hover:bg-gray-50"
        }`}
        onClick={handleLogout}
      >
        <div className="mr-3 text-red-500">
          <FiLogOut size={20} />
        </div>
        <h5 className="font-Poppins text-red-500">Logout</h5>
      </div>
    </div>
  );
};

export default SideBarProfile;
