"use client";
import React, { FC } from "react";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import CourseCard from "./CourseCard";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Link from "next/link";

interface ICourse {
  _id: string;
  name: string;
  thumbnail?: { url: string };
  ratings?: number;
  purchased?: number;
  price?: number;
  estimatedPrice?: number;
  level?: string;
  createdAt: string;
}

const CoursesPage: FC = () => {
  const { data, isLoading } = useGetAllCoursesQuery({});
  const { resolvedTheme } = useTheme();

  // Get all courses
  const allCourses: ICourse[] = Array.isArray(data)
    ? data
    : data?.courses || [];

  // Sort by creation date (newest first) and take first 4
  const latestCourses = [...allCourses]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.8,
      },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className={`  w-full py-8 `}>
      <div className="w-[90%] 800px:w-[85%] m-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative"
        >
          <motion.h2
            className={`text-4xl font-bold tracking-tight sm:text-3xl  leading-tight mb-4 ${resolvedTheme === "dark" ? "text-white" : "text-black"}`}
            whileHover={{ scale: 1.01 }}
          >
            Expand Your{" "}
            <motion.span
              className="text-gradient bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              Career Opportunity
            </motion.span>{" "}
            With Our Courses
          </motion.h2>

          {/* Floating decorative elements */}
          <motion.div
            key="decorative-1"
            className="absolute left-1/4 top-1/4 w-8 h-8 rounded-full bg-purple-500/20 blur-xl"
            animate={{
              y: [0, -15, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            key="decorative-2"
            className="absolute right-1/4 top-1/3 w-10 h-10 rounded-full bg-blue-500/20 blur-xl"
            animate={{
              y: [0, -20, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.div>

        {isLoading ? (
          <motion.div
            className="flex justify-center items-center h-[60vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            //  initial="hidden"
            animate="visible"
          >
            {latestCourses.map((course: ICourse, index) => {
              return (
                <motion.div
                  key={course._id}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true }}
                >
                  <CourseCard course={course} />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Animated CTA */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/courses" passHref>
            <motion.button
              className={`px-8 py-3 rounded-full font-semibold text-lg flex items-center gap-2 ${
                resolvedTheme === "dark"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              }`}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  resolvedTheme === "dark"
                    ? "0 0 25px rgba(168, 85, 247, 0.4)"
                    : "0 0 25px rgba(99, 102, 241, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>View All Courses</span>
              <motion.span
                animate={{
                  x: [0, 4, 0],
                  rotate: [0, 15, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CoursesPage;
