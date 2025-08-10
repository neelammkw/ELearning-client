"use client";
import React, { FC, useState } from "react";
import Protected from "../hooks/useProtected";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import Profile from "../components/Profile/Profile";
import Footer from "../components/Route/Footer";
import { useSelector } from "react-redux";
import Loader from "../components/Loader/Loader";
import { useTheme } from "next-themes";

interface Props {}

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(5); // Profile is usually the 5th item in nav
  const [route, setRoute] = useState("Login");
  const { user, isLoading } = useSelector((state: any) => state.auth);
  const { theme } = useTheme();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      className={`min-h-screen hero-animation ${
        theme === "dark"
          ? "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}
    >
      <Protected>
        <Heading
          title={`${user?.name} Profile | E-Learning`}
          description="E-Learning is a platform for students to learn and get help from teachers"
          keywords="profile, elearning, education"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Profile user={user} avatar={user?.avatar} />
        </div>
        <Footer />
      </Protected>
    </div>
  );
};

export default Page;
