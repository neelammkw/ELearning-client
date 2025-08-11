"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { FiSearch } from "react-icons/fi";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBookOpen,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useGetLayoutQuery } from "@/redux/features/layout/layoutApi";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";

const Hero = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, error } = useGetLayoutQuery("Banner");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search === "") return;
    router.push(`/courses?title=${search}`);
  };

  // Animation setup for image
  const imageRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct * 100);
    y.set(yPct * 100);
  };

  // Floating animation for decorative elements
  const floatingVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Banner data with fallback values
  const banner = data?.layout?.banner || {
    title: "Improve your Online Learning",
    subTitle: "Experience better instantly",
    description:
      "Join thousands of learners worldwide and access high-quality courses from top instructors in various fields of study.",
    image: { url: "/assets/hero2.png" },
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loader only when data is loading and not mounted yet
  if (isLoading || !mounted) {
    return <Loader />;
  }

  if (error) {
    console.error("Error loading hero content:", error);
  }

  return (
    <section
      className={`w-full py-12 md:py-24 lg:py-32 relative overflow-hidden `}
    >
      {/* Floating decorative elements */}
      <motion.div
        key="float-purple"
        className="absolute top-20 left-10 w-8 h-8 rounded-xl bg-purple-500/20 blur-xl"
        variants={floatingVariants}
        animate="float"
      />
      <motion.div
        key="float-blue"
        className="absolute bottom-1/4 right-20 w-10 h-10 rounded-xl bg-blue-500/20 blur-xl"
        variants={floatingVariants}
        animate="float"
        style={{ y: 30 }}
      />

      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Enhanced Image with 3D Effects - Fixed Version */}
          <div className="flex justify-center mt-14 md:mt-0">
            <motion.div
              ref={imageRef}
              className={`relative rounded-xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] w-60 h-60 md:w-76 md:h-76 lg:w-[400px] lg:h-[400px] 
                ${resolvedTheme === "dark" ? "border border-gray-800" : "border border-gray-100"}`}
              style={{ transform }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                x.set(0);
                y.set(0);
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Improved Glossy Overlay */}
              <div
                className={`
                absolute inset-0 rounded-xl z-10 pointer-events-none
                ${
                  resolvedTheme === "dark"
                    ? "bg-gradient-to-br from-transparent via-transparent to-black/40"
                    : "bg-gradient-to-br from-white/30 via-transparent to-transparent"
                }
              `}
              />

              {/* Dark mode background layer */}
              {resolvedTheme === "dark" && (
                <div className="absolute inset-0 bg-gray-900/30 rounded-xl z-0" />
              )}

              <Image
                src={banner.image?.url || "/assets/hero2.png"}
                alt="Online Learning"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority
                style={{
                  boxSizing: "border-box",
                }}
              />
            </motion.div>
          </div>
          {/* Content Section */}
          <div className="flex flex-col justify-center space-y-6">
            <motion.h1
              className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                className={`
                  text-transparent bg-clip-text ${
                    resolvedTheme === "dark"
                      ? "bg-gradient-to-r from-purple-400 to-pink-600"
                      : "bg-gradient-to-r from-blue-600 to-purple-600"
                  }
                `}
                transition={{ duration: 0.8 }}
              >
                {banner.title}
              </motion.span>
              <br />
              <motion.span
                className={
                  resolvedTheme === "dark" ? "text-white" : "text-black"
                }
              >
                {banner.subTitle}
              </motion.span>
            </motion.h1>

            <motion.p
              className={`max-w-[600px] md:text-xl ${
                resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {banner.description}
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="relative max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch
                  className={`w-5 h-5 ${
                    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
              <input
                type="text"
                className={`w-full p-4 pl-10 text-sm border rounded-lg transition-all duration-300 ${
                  resolvedTheme === "dark"
                    ? "bg-gray-800 border-gray-700 text-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-700/80"
                    : "bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:bg-white"
                }`}
                placeholder="Search for courses..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
              <motion.button
                className={`absolute right-2.5 bottom-2.5 font-medium rounded-lg text-sm px-4 py-2 ${
                  resolvedTheme === "dark"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md shadow-blue-400/30"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
              >
                Search
              </motion.button>
            </motion.div>

            {/* User Avatars and Stats */}
            <motion.div
              className="flex flex-col space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={`avatar-${i}`}
                    className={`w-10 h-10 rounded-full border-2 ${
                      resolvedTheme === "dark"
                        ? "border-gray-800 bg-gray-700"
                        : "border-white bg-gray-200"
                    } flex items-center justify-center`}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring" }}
                  >
                    <span
                      className={`text-xs font-medium ${
                        resolvedTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {i === 5 ? "+5K" : `U${i}`}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div
                className={`flex items-center space-x-4 text-sm ${
                  resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <FaUserGraduate className="w-4 h-4" />
                  <span>50,000+ Students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaChalkboardTeacher className="w-4 h-4" />
                  <span>500+ Instructors</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaBookOpen className="w-4 h-4" />
                  <span>1,000+ Courses</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
