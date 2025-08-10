"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { styles } from "@/app/styles/style";
import ReviewCard from "../Reviews/ReviewCard";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const Reviews = () => {
  const { theme } = useTheme();
  const { data: coursesData, isLoading } = useGetAllCoursesQuery();
  const [reviews, setReviews] = useState<any[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);

  useEffect(() => {
    if (coursesData) {
      const allReviews: any[] = [];

      coursesData.forEach((course: any) => {
        const courseName =
          course.courseData?.[0]?.title || course.name || "Our Course";

        if (course.reviews && course.reviews.length > 0) {
          allReviews.push(
            ...course.reviews.map((review: any) => ({
              ...review,
              courseName,
              user: {
                ...review.user,
                avatar: review.user?.avatar || { url: "/assets/avatar.png" },
              },
            })),
          );
        }
      });

      setReviews(allReviews);
      setFilteredReviews(allReviews.slice(0, 4));
    }
  }, [coursesData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (isLoading)
    return (
      <div className="text-center py-10">
        <div className="h-8 w-8 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!filteredReviews.length)
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No reviews available yet
      </div>
    );

  return (
    <div
      className={`w-[90%] 800px:w-[85%] m-auto py-8 ${theme === "dark" ? "text-black" : "text-white"}`}
    >
      {/* Hero-style Header Section */}
      <div className="w-full flex flex-col md:flex-row items-center gap-8 mb-12">
        <motion.div
          className="800px:w-[40%] w-full  flex justify-center"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="m-auto">
            <Image
              src="/assets/flat-giving-feedback-concept.png"
              alt="Student feedback"
              width={400}
              height={400}
              className="rounded-lg object-contain shadow-xl"
            />
          </div>
        </motion.div>

        <motion.div
          className="800px:w-[60%] w-full 800px:pl-8"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <h2
            className={`text-4xl font-bold tracking-tight  leading-tight mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}
          >
            Our Students Are{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Our Strength
            </span>
          </h2>

          <p
            className={`text-xl 800px:text-xl  ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6 leading-relaxed`}
          >
            Don&apos;t just take our word for it. Here&apos;s what our students
            have to say about their learning journey with us.
          </p>

          <h3
            className={`text-base 800px:text-lg   ${theme === "dark" ? "text-gray-500" : "text-gray-500"} font-medium italic`}
          >
            &quot;Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
            id fugiat temporibus dolores distinctio nostrum quos in.&quot;
          </h3>
        </motion.div>
      </div>

      {/* Reviews Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {filteredReviews.map((review, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className={`p-5 rounded-xl shadow-lg transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <ReviewCard item={review} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Reviews;
