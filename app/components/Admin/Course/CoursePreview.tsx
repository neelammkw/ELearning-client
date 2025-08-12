"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Star,
  Users,
  Code2,
  Infinity,
  Video,
  Clock,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import CoursePlayer from "@/app/utils/CoursePlayer";
import { motion } from "framer-motion";

type CourseContentItem = {
  title: string;
  description: string;
  videoSection: string;
  videoUrl: string;
  videoLength: number;
  links: Array<{ title: string; url: string }>;
  suggestion: string;
};

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseDatas: {
    name: string;
    description: string;
    price: number;
    estimatedPrice: number;
    purchased: number;
    tags: string;
    categories: string;
    ratings: number;
    level: string;
    demoUrl: string;
    thumbnail: string;
    benefits: Array<{ title: string }>;
    prerequisites: Array<{ title: string }>;
    courseData: CourseContentItem[];
  };
  handleCourseCreate: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
};

const CoursePreview: React.FC<Props> = ({
  active,
  setActive,
  courseDatas,
  handleCourseCreate,
  isLoading,
  isEdit,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [demoUrl, setDemoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const {
    name = "",
    description = "",
    price = 0,
    estimatedPrice = 0,
    tags = "",
    categories = "",
    level = "",
    ratings = "",
    purchased = "",
    demoUrl: demoUrlProp = "",
    thumbnail = "",
    benefits = [],
    prerequisites = [],
    courseData: courseContent = [],
  } = courseDatas || {};

  // Calculate total course duration
  const totalVideoLength = courseContent.reduce((total, item) => {
    return total + (item.videoLength || 0);
  }, 0);

  const discountPercentage =
    price > 0 ? Math.round(((price - estimatedPrice) / price) * 100) : 0;

  // Format duration to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${mins}m`;
  };

  useEffect(() => {
    if (demoUrlProp instanceof File) {
      const url = URL.createObjectURL(demoUrlProp);
      setDemoUrl(url);
    } else if (typeof demoUrlProp === "string") {
      setDemoUrl(demoUrlProp);
    }

    if (thumbnail instanceof File) {
      const url = URL.createObjectURL(thumbnail);
      setThumbnailUrl(url);
    } else if (typeof thumbnail === "string") {
      setThumbnailUrl(thumbnail);
    }

    return () => {
      if (demoUrl && typeof demoUrlProp === "object")
        URL.revokeObjectURL(demoUrl);
      if (thumbnailUrl && typeof thumbnail === "object")
        URL.revokeObjectURL(thumbnailUrl);
    };
  }, [demoUrlProp, thumbnail]);

  const handleSubmit = () => {
    handleCourseCreate();
  };

  const handleBack = () => {
    setActive(active - 1);
  };

  const renderStars = (rating: number = 4.9) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        className={`${i < Math.floor(rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300 dark:text-gray-500"}`}
      />
    ));
  };

  return (
    <div
      className={`w-full min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <h3>
          Course Preview
        </h3>
      <div className="w-[90%] max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-xl shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Header */}
              <div className="space-y-4">
                <h1
                  className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {name}
                </h1>

                {/* Demo Video Player */}
                {demoUrl && (
                  <div className="space-y-2">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <CoursePlayer
                        videoUrl={demoUrl}
                        title={`${name} - Preview`}
                      />
                    </div>
                    <p
                      className={`text-sm text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      This is a preview of the course
                    </p>
                  </div>
                )}

                {/* Course Meta */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    {renderStars()}
                    <span
                      className={`text-sm ml-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {ratings}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <Clock size={16} />
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Course Description */}
              <div className="space-y-3">
                <h2
                  className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
                >
                  Course Description
                </h2>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {description}
                </p>
              </div>

              {/* Categories */}
              {categories && (
                <div className="flex flex-wrap gap-2">
                  {categories.split(",").map((category, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDark
                          ? "bg-blue-900 text-blue-200"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {category.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Course Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Video size={20} className="text-blue-500" />
                  <span>{courseContent.length} Lectures</span>
                </div>
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Clock size={20} className="text-blue-500" />
                  <span>{formatDuration(totalVideoLength)} Total</span>
                </div>
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Code2 size={20} className="text-blue-500" />
                  <span>Source Code</span>
                </div>
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Infinity size={20} className="text-blue-500" />
                  <span>Lifetime Access</span>
                </div>
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Users size={20} className="text-blue-500" />
                  <span>{purchased} + Students</span>
                </div>
              </div>

              {/* What You'll Learn */}
              {benefits.length > 0 && (
                <div className="space-y-3">
                  <h2
                    className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
                  >
                    What you will learn
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle
                          size={18}
                          className="text-green-500 mt-0.5 flex-shrink-0"
                        />
                        <span
                          className={isDark ? "text-gray-300" : "text-gray-600"}
                        >
                          {benefit.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {prerequisites.length > 0 && (
                <div className="space-y-3">
                  <h2
                    className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
                  >
                    Prerequisites
                  </h2>
                  <ul className="space-y-2">
                    {prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle
                          size={18}
                          className="text-green-500 mt-0.5 flex-shrink-0"
                        />
                        <span
                          className={isDark ? "text-gray-300" : "text-gray-600"}
                        >
                          {prereq.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Pricing Box */}
            <div className="lg:col-span-1">
              <div
                className={`p-6 rounded-xl shadow-lg sticky top-6 ${
                  isDark ? "bg-gray-700" : "bg-white border border-gray-200"
                }`}
              >
                {thumbnailUrl && (
                  <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={thumbnailUrl}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Price Section */}
                <div className="space-y-2 mb-4">
                  {discountPercentage > 0 && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`line-through ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        ₹{price}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isDark
                            ? "bg-red-900 text-red-200"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        Save {discountPercentage}%
                      </span>
                    </div>
                  )}
                  <div
                    className={`text-3xl font-bold ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    ₹{estimatedPrice}
                  </div>
                </div>

                {/* Course Features */}
                <div
                  className={`space-y-3 text-sm mb-6 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    <span>Duration: {formatDuration(totalVideoLength)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video size={16} className="text-blue-500" />
                    <span>Lectures: {courseContent.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-blue-500" />
                    <span>Level: {level}</span>
                  </div>
                </div>

                {/* Guarantee */}
                <div
                  className={`text-center text-sm mb-6 p-3 rounded-lg ${
                    isDark
                      ? "bg-gray-600 text-gray-200"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  30-Day Money-Back Guarantee
                </div>
              </div>
            </div>
          </div>

          {/* Course Content Section */}
          {courseContent.length > 0 && (
            <div className="mt-12 space-y-6">
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Course Content
              </h2>

              <div className="space-y-4">
                {courseContent.map((video, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {video.title || "Untitled Video"}
                        </h3>
                        {video.videoSection && (
                          <p
                            className={`text-sm mt-1 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Section: {video.videoSection}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-sm flex items-center gap-1 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <Clock size={14} />
                        {formatDuration(video.videoLength || 0)}
                      </span>
                    </div>

                    {video.description && (
                      <p
                        className={`mt-2 text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {video.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isLoading
                    ? isEdit
                      ? "Updating..."
                      : "Submitting..."
                    : isEdit
                      ? "Update Course"
                      : "Submit Course"}
                </button>
                <button
                  onClick={handleBack}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    isDark
                      ? "bg-gray-600 hover:bg-gray-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CoursePreview;
