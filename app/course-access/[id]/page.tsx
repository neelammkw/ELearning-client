"use client";
import React, { useState } from "react";
import Heading from "@/app/utils/Heading";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Route/Footer";
import CourseAccess from "@/app/components/Course/CourseAccess";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import { useTheme } from "next-themes";

type Props = {
  params: {
    id: string;
  };
};

const Page = ({ params }: Props) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  // Unwrap the params promise
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(0);
  const [route, setRoute] = useState("Login");
  const { id: courseId } = React.use(params);
  const { data: userData, isLoading } = useLoadUserQuery(undefined, {});

  // Redirect if not authenticated
  if (!isLoading && !userData?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen ">
      <Heading
        title={`Course Access - ${courseId}`}
        description="Access your purchased course content"
        keywords="course, learning, education"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <div
        className={`min-h-[80vh] mt-20 hero-animation ${
          theme === "dark"
            ? "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
            : "bg-gradient-to-br from-blue-50 to-purple-50"
        }`}
      >
        <CourseAccess id={courseId} user={userData?.user} />
        <Footer />
      </div>
    </div>
  );
};

export default Page;
