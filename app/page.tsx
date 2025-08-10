"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import Faq from "./components/Route/Faq";
import Footer from "./components/Route/Footer";
import { useTheme } from "next-themes";

const Page: FC = () => {
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
        <Hero />
        <Courses />
        <Reviews />
        <Faq />
        <Footer />
      </section>
    </div>
  );
};

export default Page;
