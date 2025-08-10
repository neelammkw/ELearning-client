"use client";
import React, { FC } from "react";
import { ICourse } from "@/types/course";
import Image from "next/image";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  course: ICourse;
}

const CourseCard: FC<Props> = ({ course }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const stars = Array(5).fill(0);
  const rating = course.ratings || 0;

  // Prefetch the course page when hovering over the card
  const handleHoverStart = () => {
    router.prefetch(`/course/${course._id}`);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/course/${course._id}`);
  };

  return (
    <div className="relative p-3">
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
            href={`/course/${course._id}`}
            className="cursor-pointer"
            prefetch={false} // Let the hover prefetch handle this
          >
            <h3
              className={`text-lg font-bold mb-2 line-clamp-2 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              {course.name || "Untitled Course"}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-0.5">
              {stars.map((_, index) => (
                <span
                  key={index}
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {rating > index ? (
                    <AiFillStar className="w-3.5 h-3.5 text-yellow-400" />
                  ) : (
                    <AiOutlineStar className="w-3.5 h-3.5" />
                  )}
                </span>
              ))}
              <span
                className={`text-xs ml-1.5 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                ({course.reviews?.length || 0})
              </span>
            </div>
            <span
              className={`text-xs ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {course.purchased || 0} students
            </span>
          </div>

          {/* Price Section */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-baseline">
              <span
                className={`text-lg font-bold ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {course.price ? `$${course.price}` : "Free"}
              </span>
              {course.estimatedPrice && (
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
              className={`text-xs px-2.5 py-1 rounded-md cursor-pointer ${
                theme === "dark"
                  ? "bg-blue-600/90 hover:bg-blue-500 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-white"
              } transition-colors`}
            >
              Enroll
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseCard;
