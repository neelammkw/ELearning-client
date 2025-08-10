"use client";
import React, { FC, useState, useEffect } from "react";
import SideBarProfile from "./SideBarProfile";
import { useTheme } from "next-themes";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import EnrolledCourses from "./EnrolledCourses";
import PurchasedHistory from "./PurchasedHistory";
import AdminDashboard from "../../admin/page";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

type ProfileProps = {
  avatar: string | null;
  user: any;
};

const Profile: FC<ProfileProps> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [active, setActive] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;

  // Navigation items
  const navItems = [
    {
      id: 1,
      label: "Profile",
      component: <ProfileInfo avatar={avatar} user={user} />,
    },
    { id: 2, label: "Password", component: <ChangePassword user={user} /> },
    { id: 3, label: "Courses", component: <EnrolledCourses /> },
    { id: 4, label: "History", component: <PurchasedHistory /> },
    { id: 5, label: "Admin", component: <AdminDashboard /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 85);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar when clicking outside or when route changes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("profile-sidebar");
      const menuButton = document.getElementById("menu-button");
      if (
        sidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        !menuButton?.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="w-full lg:w-[85%] mx-auto pt-20 lg:pt-[100px] px-4 lg:px-0">
      {/* Mobile Header */}
      <div
        className={`flex lg:hidden justify-between rounded-xl p-2 items-center mb-6 sticky top-16 z-40 py-3 ${currentTheme === "dark" ? "bg-slate-800" : "bg-white"} `}
      >
        <h1
          className={`text-xl font-bold ${currentTheme === "dark" ? "text-white" : "text-black"}`}
        >
          {navItems.find((item) => item.id === active)?.label}
        </h1>
        <button
          id="menu-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-lg ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <IoClose
              size={24}
              className={
                currentTheme === "dark" ? "text-white" : "text-gray-800"
              }
            />
          ) : (
            <FiMenu
              size={24}
              className={
                currentTheme === "dark" ? "text-white" : "text-gray-800"
              }
            />
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Hidden on mobile by default */}
        <div
          id="profile-sidebar"
          className={`fixed lg:relative inset-0 lg:inset-auto z-50 mt-1 lg:z-auto w-3/4 lg:w-[310px] h-full lg:h-[450px] transform ${
            sidebarOpen
              ? "translate-y-15 "
              : "-translate-x-full lg:translate-x-0"
          } transition-transform duration-300 ease-in-out ${
            currentTheme === "dark" ? "bg-slate-800" : "bg-white"
          } border-r lg:border ${
            currentTheme === "dark" ? "border-slate-700" : "border-gray-200"
          } lg:rounded-lg shadow-lg lg:shadow-sm`}
        >
          <div className="h-full overflow-y-auto p-4">
            <SideBarProfile
              active={active}
              setActive={(id) => {
                setActive(id);
                setSidebarOpen(false);
              }}
            />
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed  bg-opacity-50  mt-15 z-80 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-8">
          <div
            className={`p-4 lg:p-6 rounded-lg ${
              currentTheme === "dark" ? "bg-slate-800" : "bg-white"
            } shadow border ${
              currentTheme === "dark" ? "border-slate-700" : "border-gray-200"
            } min-h-[calc(100vh-180px)]`}
          >
            <div
              className={`${currentTheme === "dark" ? "text-gray-200" : "text-gray-800"}`}
            >
              {navItems.find((item) => item.id === active)?.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
