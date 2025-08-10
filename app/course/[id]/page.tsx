"use client";

import CourseDetail from "../../components/Course/CourseDetail";
import React, { useState } from "react";
import Heading from "../../utils/Heading";
import Header from "../../components/Header";
import Footer from "../../components/Route/Footer";
import { useTheme } from "next-themes";
import { use } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const courseId = use(params).id;

  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen">
      <section
        className={`hero-animation ${
          theme === "dark"
            ? "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
            : "bg-gradient-to-br from-blue-50 to-purple-50"
        }`}
      >
        <Heading
          title="ELearning"
          description="Elearning platform for students"
          keywords="education, learning, courses"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <CourseDetail id={courseId} />
        <Footer />
      </section>
    </div>
  );
}
