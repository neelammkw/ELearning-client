"use client";
import React, { FC, useState } from "react";
import { useTheme } from "next-themes";
import {
  Star,
  Users,
  Video,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import CoursePlayer from "@/app/utils/CoursePlayer";
import { motion } from "framer-motion";
import { useGetFullCourseQuery } from "@/redux/features/courses/coursesApi";
import Loader from "@/app/components/Loader/Loader";
import { useRouter } from "next/navigation";
import { Button, Avatar, Chip, Collapse } from "@mui/material";
import { formatDate as format } from "../../../utils/dateUtils";

type Props = {
  id: string;
};

const ViewCourse: FC<Props> = ({ id }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"content" | "reviews">("content");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const { data, isLoading, error } = useGetFullCourseQuery(id);
  const course = data?.course;
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Calculate total course duration
  const totalVideoLength =
    course?.courseData?.reduce((total, section: any) => {
      return (
        total +
        (section.videos?.reduce((sectionTotal: number, video: any) => {
          return sectionTotal + (video.videoLength || 0);
        }, 0) || 0)
      );
    }, 0) || 0;

  const discountPercentage =
    course?.price > 0 && course?.estimatedPrice > 0
      ? Math.round(
          ((course.price - course.estimatedPrice) / course.price) * 100,
        )
      : 0;

  // Format duration to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${mins}m`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        className={`${i < Math.floor(rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300 dark:text-gray-500"}`}
      />
    ));
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div
        className={`text-center py-8 ${isDark ? "text-red-400" : "text-red-600"}`}
      >
        Error loading course
      </div>
    );
  if (!course)
    return (
      <div
        className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}
      >
        Course not found
      </div>
    );

  return (
    <div
      className={`w-full min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="w-[90%] max-w-7xl mx-auto py-8">
        <Button
          startIcon={<ChevronLeft size={20} />}
          onClick={() => router.back()}
          className="mb-4"
          sx={{
            color: isDark ? "white" : "black",
            "&:hover": {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          Back to Courses
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-xl shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}
        >
          <div>
            {/* Left Column - Main Content */}
            <div>
              {/* Course Header */}
              <div className="space-y-4">
                <h1
                  className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {course.name}
                </h1>

                {/* Demo Video Player */}
                {course.demoUrl?.url && (
                  <div className="space-y-2">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <CoursePlayer
                        videoUrl={course.demoUrl.url}
                        title={`${course.name} - Preview`}
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
                    {renderStars(course.ratings || 0)}
                    <span
                      className={`text-sm ml-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                      ({course.reviews?.length || 0} reviews)
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <Clock size={16} />
                    <span>Last updated: {formatDate(course.updatedAt)}</span>
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
                  {course.description}
                </p>
              </div>

              {/* Categories */}
              {course.categories && (
                <div className="flex flex-wrap gap-2">
                  <Chip
                    label={course.categories.trim()}
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: isDark
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(59, 130, 246, 0.1)",
                      color: isDark
                        ? "rgb(147, 197, 253)"
                        : "rgb(59, 130, 246)",
                    }}
                  />
                </div>
              )}

              {/* Navigation Tabs */}
              <div
                className={`flex border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
              >
                <button
                  onClick={() => setActiveTab("content")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "content"
                      ? isDark
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-blue-600 border-b-2 border-blue-600"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-600"
                  }`}
                >
                  Course Content
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "reviews"
                      ? isDark
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-blue-600 border-b-2 border-blue-600"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-600"
                  }`}
                >
                  Reviews ({course.reviews?.length || 0})
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "content" && (
                <>
                  {/* What You'll Learn */}
                  {course.benefits?.length > 0 && (
                    <div className="space-y-3">
                      <h2
                        className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
                      >
                        What you'll learn
                      </h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.benefits.map((benefit: any, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle
                              size={18}
                              className="text-green-500 mt-0.5 flex-shrink-0"
                            />
                            <span
                              className={
                                isDark ? "text-gray-300" : "text-gray-600"
                              }
                            >
                              {benefit.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {course.prerequisites?.length > 0 && (
                    <div className="space-y-3">
                      <h2
                        className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
                      >
                        Prerequisites
                      </h2>
                      <ul className="space-y-2">
                        {course.prerequisites.map(
                          (prereq: any, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle
                                size={18}
                                className="text-green-500 mt-0.5 flex-shrink-0"
                              />
                              <span
                                className={
                                  isDark ? "text-gray-300" : "text-gray-600"
                                }
                              >
                                {prereq.title}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Course Content Section */}
                  {course.courseData?.length > 0 && (
                    <div className="space-y-4 mt-6">
                      <div className="space-y-2">
                        {/* Course Content Section */}
                        {course.courseData?.length > 0 && (
                          <div className="space-y-4 mt-6">
                            <h2
                              className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
                            >
                              Course Content
                            </h2>

                            <div className="space-y-2">
                              {course.courseData.map((section: any) => (
                                <div
                                  key={section._id}
                                  className={`rounded-lg overflow-hidden ${
                                    isDark
                                      ? "bg-gray-700"
                                      : "bg-white border border-gray-200"
                                  }`}
                                >
                                  <button
                                    onClick={() => toggleSection(section._id)}
                                    className={`w-full flex justify-between items-center p-4 ${
                                      isDark
                                        ? "hover:bg-gray-600"
                                        : "hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <h3
                                        className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}
                                      >
                                        {section.videoSection ||
                                          "Untitled Section"}
                                      </h3>
                                      <span
                                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                                      >
                                        {section.videoUrl?.url
                                          ? "1 lecture"
                                          : "0 lectures"}{" "}
                                        •{" "}
                                        {formatDuration(
                                          section.videoLength || 0,
                                        )}
                                      </span>
                                    </div>
                                    {expandedSections[section._id] ? (
                                      <ChevronUp
                                        size={20}
                                        className={
                                          isDark
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                        }
                                      />
                                    ) : (
                                      <ChevronDown
                                        size={20}
                                        className={
                                          isDark
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                        }
                                      />
                                    )}
                                  </button>

                                  <Collapse in={expandedSections[section._id]}>
                                    <div className="p-4 pt-0">
                                      {section.description && (
                                        <p
                                          className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                                        >
                                          {section.description}
                                        </p>
                                      )}

                                      {/* Display the main video/content of the section */}
                                      {section.videoUrl?.url && (
                                        <div className="mb-4">
                                          <div className="aspect-video rounded-lg overflow-hidden">
                                            <CoursePlayer
                                              videoUrl={section.videoUrl.url}
                                              title={
                                                section.title || "Section Video"
                                              }
                                            />
                                          </div>
                                          <div className="mt-2">
                                            <h4
                                              className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                            >
                                              {section.title ||
                                                "Untitled Content"}
                                            </h4>
                                            {section.videoLength && (
                                              <span
                                                className={`text-xs flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                                              >
                                                <Clock size={12} />
                                                {formatDuration(
                                                  section.videoLength,
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Section Questions */}
                                      {section.questions?.length > 0 && (
                                        <div className="mt-4">
                                          <h5
                                            className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                                          >
                                            Questions & Answers
                                          </h5>
                                          <div className="space-y-3">
                                            {section.questions.map(
                                              (question: any) => (
                                                <div
                                                  key={question._id}
                                                  className={`p-3 rounded ${isDark ? "bg-gray-600" : "bg-gray-100"}`}
                                                >
                                                  <div className="flex items-start gap-2">
                                                    <div>
                                                      <h6
                                                        className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}
                                                      >
                                                        {question.user?.name ||
                                                          "Anonymous"}{" "}
                                                        asked:
                                                      </h6>
                                                      <p
                                                        className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                                                      >
                                                        {question.question}
                                                      </p>
                                                      {question.questionReplies
                                                        ?.length > 0 && (
                                                        <div className="mt-2 pl-4 border-l-2 border-blue-500">
                                                          {question.questionReplies.map(
                                                            (reply: any) => (
                                                              <div
                                                                key={reply._id}
                                                                className="mb-2"
                                                              >
                                                                <p
                                                                  className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                                                                >
                                                                  <span className="font-medium">
                                                                    {reply.user
                                                                      ?.name ||
                                                                      "Instructor"}
                                                                  </span>{" "}
                                                                  replied:
                                                                </p>
                                                                <p
                                                                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                                                                >
                                                                  {reply.answer}
                                                                </p>
                                                              </div>
                                                            ),
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Section Reviews */}
                                      {section.reviews?.length > 0 && (
                                        <div className="mt-4">
                                          <h5
                                            className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                                          >
                                            Student Feedback
                                          </h5>
                                          <div className="space-y-3">
                                            {section.reviews.map(
                                              (review: any) => (
                                                <div
                                                  key={review._id}
                                                  className={`p-3 rounded ${isDark ? "bg-gray-600" : "bg-gray-100"}`}
                                                >
                                                  <div className="flex items-start gap-3">
                                                    <Avatar
                                                      src={
                                                        review.user?.avatar?.url
                                                      }
                                                      alt={review.user?.name}
                                                      sx={{
                                                        width: 32,
                                                        height: 32,
                                                      }}
                                                    />
                                                    <div>
                                                      <div className="flex items-center gap-1">
                                                        {renderStars(
                                                          review.rating,
                                                        )}
                                                      </div>
                                                      <p
                                                        className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                                                      >
                                                        {review.comment}
                                                      </p>
                                                      {review.commentReplies
                                                        ?.length > 0 && (
                                                        <div className="mt-2 pl-4 border-l-2 border-blue-500">
                                                          {review.commentReplies.map(
                                                            (reply: any) => (
                                                              <div
                                                                key={reply._id}
                                                                className="mb-2"
                                                              >
                                                                <p
                                                                  className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                                                                >
                                                                  <span className="font-medium">
                                                                    {reply.user
                                                                      ?.name ||
                                                                      "Instructor"}
                                                                  </span>{" "}
                                                                  replied:
                                                                </p>
                                                                <p
                                                                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                                                                >
                                                                  {
                                                                    reply.comment
                                                                  }
                                                                </p>
                                                              </div>
                                                            ),
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Section Links */}
                                      {section.links?.length > 0 && (
                                        <div className="mt-4">
                                          <h5
                                            className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                                          >
                                            Resources
                                          </h5>
                                          <ul className="space-y-2">
                                            {section.links.map((link: any) => (
                                              <li key={link._id}>
                                                <a
                                                  href={link.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className={`text-sm flex items-center gap-2 ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
                                                >
                                                  <span>{link.title}</span>
                                                </a>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </Collapse>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2
                        className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
                      >
                        Reviews
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(course.ratings || 0)}
                        <span
                          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                        >
                          {course.ratings?.toFixed(1) || "0.0"} out of 5
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {course.reviews?.length || 0} total reviews
                    </span>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {course.reviews?.length > 0 ? (
                      course.reviews.map((review: any) => (
                        <div
                          key={review._id}
                          className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-white border border-gray-200"}`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar
                              src={review.user?.avatar?.url}
                              alt={review.user?.name}
                              sx={{ width: 40, height: 40 }}
                            />
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <h4
                                    className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}
                                  >
                                    {review.user?.name}
                                  </h4>
                                  <div className="flex items-center gap-1 mt-1">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                                <span
                                  className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                              <p
                                className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                              >
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        No reviews yet. Be the first to review!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewCourse;
