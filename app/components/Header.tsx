"use client";
import Link from "next/link";
import React, { FC, useState, useEffect } from "react";
import NavItems from "../components/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { useTheme } from "next-themes";
import {
  HiOutlineMenuAlt3,
  HiOutlineUserCircle,
  HiOutlineLogout,
} from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Image from "next/image";
import Verification from "../components/Auth/Verification";
import { useSelector } from "react-redux";
import avatarIcon from "../../public/assets/avatar.png";
import { useSession, signOut } from "next-auth/react";
import { useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { SiUdemy } from "react-icons/si";
import { useLogoutMutation } from "@/redux/features/auth/authApi";

type HeaderProps = {
  activeItem: number;
  setOpen?: (open: boolean) => void;
  route?: string;
  open?: boolean;
  setRoute?: (route: string) => void;
};

const Header: FC<HeaderProps> = ({
  activeItem,
  setOpen,
  route,
  open,
  setRoute,
}) => {
  const [active, setActive] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useSession();
  const [logout, setLogout] = useState(false);
  const [logoutMutation] = useLogoutMutation();
  let hideTimeout: ReturnType<typeof setTimeout>;

  const { refetch } = useLoadUserQuery(undefined, {
    skip: !logout,
  });

  const [socialAuth, { isSuccess }] = useSocialAuthMutation();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      await logoutMutation(undefined);
      setLogout(true);
      toast.success("Logged out successfully");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "screen") {
      setOpenSidebar(false);
    }
  };

  useEffect(() => {
    if (!user && data) {
      socialAuth({
        email: data.user?.email,
        name: data.user?.name,
        avatar: data.user?.image,
      });
    }
    if (isSuccess) toast.success("Login Successfully");
    if (data === null) setLogout(true);
  }, [data, user, isSuccess, socialAuth]);

  useEffect(() => {
    setMounted(true);
    window.addEventListener("scroll", () => setActive(window.scrollY > 85));
    return () => window.removeEventListener("scroll", () => setActive(false));
  }, []);

  useEffect(() => {
    if (logout) refetch();
  }, [logout, refetch]);

  if (!mounted) return null;

  return (
    <div className="w-full relative">
      {/* Desktop Header */}
      <div
        className={`
        w-full h-[80px] fixed z-[80] top-0 left-0
        hero-animation ${theme === "dark"
            ? "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
            : "bg-gradient-to-br from-blue-50 to-purple-50"
          }
        transition-all duration-500
      `}
      >
        {active && (
          <div
            className={`
            absolute bottom-0 left-0 w-full h-1
            bg-gradient-to-r from-transparent via-blue-500 to-transparent
            ${theme === "dark" ? "opacity-30" : "opacity-20"}
          `}
          ></div>
        )}

        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <Link href="/" className="flex items-center gap-2">
              <SiUdemy className="text-3xl text-purple-600" />
              <span
                className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                ELearning
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />

              {/* Mobile Menu Button */}
              <button
                className="block md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-200 transition-colors"
                onClick={() => setOpenSidebar(true)}
              >
                <HiOutlineMenuAlt3
                  size={22}
                  className={theme === "dark" ? "text-white" : "text-black"}
                />
              </button>

              {/* User Avatar */}
              {user ? (
                <div
                  className="relative hidden md:block"
                  onMouseEnter={() => {
                    clearTimeout(hideTimeout); // cancel hide if re-entered
                    setAvatarDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    hideTimeout = setTimeout(
                      () => setAvatarDropdownOpen(false),
                      150,
                    );
                  }}
                >
                  <div className="flex items-center">
                    <Image
                      src={user.avatar?.url || avatarIcon}
                      alt="Profile"
                      width={34}
                      height={34}
                      className="rounded-full cursor-pointer border-2 border-purple-500"
                    />
                  </div>

                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 transition-all duration-200 ease-in-out ${avatarDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
                  >
                    <div
                      className={`${theme === "dark" ? "bg-gray-400" : "bg-white"} p-1 rounded-lg`}
                    >
                      <Link
                        href="/profile"
                        className={`flex items-center px-4 py-3 text-sm rounded-t-lg ${theme === "dark"
                            ? "hover:bg-gray-300"
                            : "hover:bg-gray-100"
                          }`}
                      >
                        <HiOutlineUserCircle className="mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`flex items-center w-full text-left px-4 py-3 text-sm rounded-b-lg ${theme === "dark"
                            ? "bg-gray-300"
                            : "bg-gray-700"
                          }`}
                      >
                        <HiOutlineLogout className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  onClick={() => {
                    setRoute && setRoute("Login");
                    setOpen && setOpen(true);
                  }}
                >
                  <HiOutlineUserCircle size={18} />
                  <span className="text-sm">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {openSidebar && (
        <div
          className="fixed w-full h-screen top-0 left-0 z-[99999] bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
          id="screen"
        >
          <div
            className={`
  w-[50%] h-[70%] fixed z-[9999999]
  ${theme === "dark" ? "bg-gray-900/40" : "bg-blue-300/40"} 
  top-0 right-0 shadow-xl transition-transform duration-300
  ${openSidebar ? "translate-x-0" : "translate-x-full"}
  backdrop-blur-sm  
  border-l ${theme === "dark" ? "border-gray-700" : "border-gray-200"} 
`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                  <SiUdemy className="text-2xl text-purple-600" />
                  <span
                    className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
                  >
                    ELearning
                  </span>
                </Link>
                <button
                  onClick={() => setOpenSidebar(false)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-2 overflow-y-auto">
              <NavItems activeItem={activeItem} isMobile={true} />

              <div className="mt-2 space-y-1">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className={`flex items-center px-3 py-2 rounded-lg ${theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                        }`}
                      onClick={() => setOpenSidebar(false)}
                    >
                      <Image
                        src={user.avatar?.url || avatarIcon}
                        alt="Profile"
                        width={28}
                        height={28}
                        className="rounded-full mr-3"
                      />
                      <div className={`${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs ">View profile</p>
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setOpenSidebar(false);
                      }}
                      className={`flex items-center w-full px-3 py-2 rounded-lg text-left ${theme === "dark"
                          ? "hover:bg-gray-300 text-gray-300"
                          : "hover:bg-gray-500 text-gray-800"
                        }`}
                    >
                      <HiOutlineLogout className="mr-3 text-base" />
                      <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setRoute && setRoute("Login");
                      setOpen && setOpen(true);
                      setOpenSidebar(false);
                    }}
                    className={`flex items-center justify-center w-full px-3 py-2.5 rounded-lg ${theme === "dark"
                        ? "bg-purple-700 hover:bg-purple-600"
                        : "bg-purple-600 hover:bg-purple-700"
                      } text-white text-sm`}
                  >
                    <HiOutlineUserCircle className="mr-2 text-base" />
                    <span>Login / Register</span>
                  </button>
                )}
              </div>
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 p-3 text-center text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-100"
                } border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
            >
              © 2025 ELearning. All rights reserved.
            </div>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      {route === "Login" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Login}
        />
      )}

      {route === "Sign-Up" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={SignUp}
        />
      )}

      {route === "Verification" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Verification}
        />
      )}
    </div>
  );
};

export default Header;
