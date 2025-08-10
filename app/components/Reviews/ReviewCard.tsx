"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { IoStarHalfOutline, IoStarOutline } from "react-icons/io5";
import { useTheme } from "next-themes";

type Props = {
  item: any;
};

const ReviewCard = ({ item }: Props) => {
  const { theme } = useTheme();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-[12px]" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <IoStarHalfOutline key={i} className="text-yellow-400 text-[12px]" />,
        );
      } else {
        stars.push(
          <IoStarOutline key={i} className="text-yellow-400 text-[12px]" />,
        );
      }
    }

    return stars;
  };

  return (
    <div className="h-full flex flex-col">
      {/* User Info Row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`relative w-10 h-10 rounded-full overflow-hidden border ${
            theme === "dark" ? "border-purple-400" : "border-purple-600"
          }`}
        >
          <Image
            src={item.user?.avatar?.url || "/assets/avatar.png"}
            alt={item.user?.name || "User"}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div className="truncate">
              <h5
                className={`text-sm font-semibold truncate ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {item.user?.name || "Anonymous"}
              </h5>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } truncate`}
              >
                {item.user?.profession || "Student"}
              </p>
            </div>
            <div className="flex items-center gap-0.5 ml-2">
              {renderStars(item.rating || 5)}
            </div>
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="mb-2 text-xs">
        <span
          className={`font-medium ${
            theme === "dark" ? "text-purple-400" : "text-purple-600"
          }`}
        >
          Course:
        </span>
        <span
          className={`ml-1 truncate ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {item.courseName || "Our Course"}
        </span>
      </div>

      {/* Review Text */}
      <div className="relative">
        <FaQuoteLeft
          className={`absolute top-0 left-0 text-sm ${
            theme === "dark" ? "text-gray-600" : "text-gray-300"
          }`}
        />
        <p
          className={`pl-5 text-xs italic line-clamp-3 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {item.comment || "This course was amazing! I learned so much."}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
