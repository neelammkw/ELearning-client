"use client";
import React, { FC } from "react";
// import { ICourse } from "@/types/course";
import Image from "next/image";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  course: ICourse;
  showProgress?: boolean;
  isEnrolled?: boolean;
  isProfile?: boolean;
}

const CourseCard: FC<Props> = ({
  course,
  showProgress = false,
  isEnrolled = false,
  isProfile = false,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const stars = Array(5).fill(0);
  const rating = course.ratings || 0;
  const progress = course.progress || 0;

  // Prefetch the course page when hovering over the card
  const handleHoverStart = () => {
    router.prefetch(
      isEnrolled ? `/course/${course._id}` : `/course/${course._id}`,
    );
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(isEnrolled ? `/course/${course._id}` : `/course/${course._id}`);
  };

  return (
    <div className="relative p-2">
      {/* Progress Bar Overlay */}
      {showProgress && (
        <div className="absolute top-4 left-4 right-4 bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-2 z-10">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <motion.div
        className={`relative w-full h-full rounded-xl overflow-hidden border ${
          theme === "dark"
            ? "bg-gray-800/80 border-gray-700/30"
            : "bg-white/90 border-gray-200/30"
        }`}
        whileHover={{
          y: -5,
          boxShadow:
            theme === "dark"
              ? "0 10px 30px -5px rgba(59, 130, 246, 0.3)"
              : "0 10px 30px -5px rgba(0, 0, 0, 0.15)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        onHoverStart={handleHoverStart}
      >
        {/* Image Container */}
        <div className="relative w-full h-40 overflow-hidden">
          <Image
            src={course.thumbnail?.url || "/default-course.png"}
            alt={course.name || "Course thumbnail"}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="/default-course-blur.png"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${
              theme === "dark"
                ? "from-black/40 via-black/15 to-transparent"
                : "from-gray-800/20 via-gray-800/10 to-transparent"
            }`}
          />
          <div
            className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
              theme === "dark"
                ? "bg-blue-600/90 text-white"
                : "bg-gray-800/95 text-white"
            }`}
          >
            {course.level || "All"}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4">
          <Link
            href={
              isEnrolled
                ? `/course-access/${course._id}`
                : `/course/${course._id}`
            }
            className="cursor-pointer"
            prefetch={false}
          >
            <h3
              className={`text-lg font-bold mb-2 line-clamp-2 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              {course.name || "Untitled Course"}
            </h3>
          </Link>

          {/* Rating and Students */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-0.5">
              {stars.map((_, index) => (
                <span
                  key={index}
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {rating > index ? (
                    <AiFillStar className="w-3 h-3 text-yellow-400" />
                  ) : (
                    <AiOutlineStar className="w-3 h-3" />
                  )}
                </span>
              ))}
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {course.purchased || 0} students
            </div>
          </div>

          {/* Price Section */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-baseline">
              <span
                className={`text-lg font-bold ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {course.price === 0 ? "Free" : `$${course.price}`}
              </span>
              {course.estimatedPrice &&
                course.estimatedPrice > course.price && (
                  <span
                    className={`text-xs line-through ml-1.5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    ${course.estimatedPrice}
                  </span>
                )}
            </div>
            <button
              onClick={handleClick}
              className={`text-sm px-3 py-1.5 rounded-md cursor-pointer ${
                isEnrolled
                  ? theme === "dark"
                    ? "bg-green-600/90 hover:bg-green-500 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                  : theme === "dark"
                    ? "bg-blue-600/90 hover:bg-blue-500 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
              } transition-colors`}
            >
              {isEnrolled
                ? progress >= 100
                  ? "Review"
                  : "Continue"
                : "Enroll"}
            </button>
          </div>

          {/* Detailed Progress (for profile view) */}
          {isProfile && (
            <div className="mt-3 text-center">
              <div className="text-xs mb-1">
                {progress}% completed • {course.courseData?.length || 0}{" "}
                sections
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CourseCard;
