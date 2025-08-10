"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FiClock, FiCheckCircle, FiLock, FiUnlock } from "react-icons/fi";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaStar,
} from "react-icons/fa";
import Loader from "../Loader/Loader";
import {
  useGetCourseContentQuery,
  useLikeVideoMutation,
  useDislikeVideoMutation,
  useAddVideoReviewMutation,
  useReplyToReviewMutation,
  useReplyToQuestionMutation,
  useAddVideoQuestionMutation,
} from "@/redux/features/courses/coursesApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Heading from "../../utils/Heading";
import CoursePlayer from "../../utils/CoursePlayer";
import { formatDuration } from "../../utils/formatDuration";
import { motion } from "framer-motion";
import Image from "next/image";
import avatarIcon from "../../../public/assets/avatar.png";
// import { Socket } from 'socket.io-client'

type Props = {
  id: string;
  user: any;
};

const CourseAccess = ({ id, user }: Props) => {
  // const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || '';
  // const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
  const { theme } = useTheme();
  const router = useRouter();

  // State management
  const [activeVideo, setActiveVideo] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [question, setQuestion] = useState("");
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [replyingToReviewId, setReplyingToReviewId] = useState<string | null>(
    null,
  );
  const [replyingToQuestionId, setReplyingToQuestionId] = useState<
    string | null
  >(null);
  const [questionReplyInput, setQuestionReplyInput] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<string, boolean>
  >({});

  // API calls
  const {
    data: contentData,
    isLoading,
    error,
    refetch,
  } = useGetCourseContentQuery(id, { refetchOnMountOrArgChange: true });
  const { refetch: refetchUser } = useLoadUserQuery(undefined, {});
  const [likeVideo] = useLikeVideoMutation();
  const [dislikeVideo] = useDislikeVideoMutation();
  const [addVideoReview] = useAddVideoReviewMutation();
  // const [markAsCompleted] = useMarkAsCompletedMutation()
  const [replyToReview] = useReplyToReviewMutation();
  const [replyToQuestion] = useReplyToQuestionMutation();
  const [addVideoQuestion] = useAddVideoQuestionMutation();

  // Group content by sections
  const groupedContent =
    contentData?.content?.reduce((acc: any[], section: any) => {
      const existingSection = acc.find(
        (s) => s.videoSection === section.videoSection,
      );
      if (existingSection) {
        existingSection.videos.push(section);
      } else {
        acc.push({
          videoSection: section.videoSection,
          description: section.description || "",
          videos: [section],
        });
      }
      return acc;
    }, []) || [];

  // Effects
  useEffect(() => {
    if (error) {
      toast.error("Error loading course content");
      console.error("Course content error:", error);
    }
  }, [error]);

  useEffect(() => {
    refetch();
    refetchUser();
  }, [refetch, refetchUser]);

  // Helper functions
  const getCurrentVideo = () => {
    if (!groupedContent[activeSection]?.videos?.[activeVideo]) return null;
    return groupedContent[activeSection].videos[activeVideo];
  };
  const toggleReviewReplies = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const toggleQuestionReplies = (questionId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const currentVideo = getCurrentVideo();

  useEffect(() => {
    if (currentVideo && user?._id) {
      setLiked(currentVideo.likes?.includes(user._id) || false);
      setDisliked(currentVideo.dislikes?.includes(user._id) || false);

      // Check if video is completed
      const course = user.courses?.find(
        (c: any) => c.courseId.toString() === id,
      );
      if (course) {
        const completed = course.completedLectures?.some(
          (lectureId: Types.ObjectId) =>
            lectureId.toString() === currentVideo._id,
        );
        setIsCompleted(completed || false);
      }
    }
  }, [currentVideo, user, id]);

  const handleAddReply = async (reviewId: string) => {
    if (!replyInput.trim()) {
      toast.error("Reply message is required");
      return;
    }

    try {
      if (!currentVideo) return;

      const result = await replyToReview({
        courseId: id,
        contentId: currentVideo._id,
        reviewId,
        reply: replyInput,
      }).unwrap();

      setReplyInput("");
      setReplyingToReviewId(null);
      refetch();
      toast.success(result.message || "Reply added successfully");
    } catch (error: any) {
      console.error("Add reply error:", error);
      toast.error(error?.data?.message || "Failed to add reply");
    }
  };

  const handleVideoLoadStart = () => setIsLoadingVideo(true);
  const handleVideoLoaded = () => setIsLoadingVideo(false);

  const navigateVideo = (direction: "prev" | "next") => {
    const currentSection = groupedContent[activeSection];
    if (!currentSection) return;

    if (direction === "prev") {
      if (activeVideo > 0) {
        setActiveVideo(activeVideo - 1);
      } else if (activeSection > 0) {
        const prevSection = groupedContent[activeSection - 1];
        setActiveSection(activeSection - 1);
        setActiveVideo(prevSection.videos.length - 1);
      }
    } else {
      if (activeVideo < currentSection.videos.length - 1) {
        setActiveVideo(activeVideo + 1);
      } else if (activeSection < groupedContent.length - 1) {
        setActiveSection(activeSection + 1);
        setActiveVideo(0);
      }
    }
  };

  const handleLikeVideo = async () => {
    try {
      if (!currentVideo) return;

      const result = await likeVideo({
        courseId: id,
        contentId: currentVideo._id,
      }).unwrap();

      setLiked(result.isLiked);
      setDisliked(false);
      refetch();
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to like video");
    }
  };
  const handleDislikeVideo = async () => {
    try {
      if (!currentVideo) return;

      const result = await dislikeVideo({
        courseId: id,
        contentId: currentVideo._id,
      }).unwrap();

      setDisliked(result.isDisliked);
      setLiked(false);
      refetch();
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to dislike video");
    }
  };

  const handleAddReview = async () => {
    if (!reviewRating || !reviewComment) {
      toast.error("Please provide both rating and comment");
      return;
    }

    try {
      if (!currentVideo) return;

      const result = await addVideoReview({
        courseId: id,
        contentId: currentVideo._id,
        review: {
          rating: reviewRating,
          comment: reviewComment,
        },
      }).unwrap();

      setReviewRating(0);
      setReviewComment("");
      refetch();
      toast.success(result.message || "Review submitted successfully");
    } catch (error: any) {
      console.error("Add review error:", error);
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  const handleAddQuestion = async () => {
    if (!question.trim()) {
      toast.error("Question cannot be empty");
      return;
    }

    try {
      if (!currentVideo) return;

      const result = await addVideoQuestion({
        courseId: id,
        contentId: currentVideo._id,
        question,
      }).unwrap();

      setQuestion("");
      refetch();
      toast.success(result.message || "Question added successfully");
    } catch (error: any) {
      console.error("Add question error:", error);
      toast.error(error?.data?.message || "Failed to add question");
    }
  };

  const handleReplyToQuestion = async (questionId: string) => {
    if (!questionReplyInput.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      if (!currentVideo) return;

      const result = await replyToQuestion({
        courseId: id,
        contentId: currentVideo._id,
        questionId,
        reply: questionReplyInput,
      }).unwrap();

      setQuestionReplyInput("");
      setReplyingToQuestionId(null);
      refetch();
      toast.success(result.message || "Reply added successfully");
    } catch (error: any) {
      console.error("Reply to question error:", error);
      toast.error(error?.data?.message || "Failed to add reply");
    }
  };
  useEffect(() => {
    if (currentVideo && user?.courses) {
      const course = user.courses.find(
        (c: any) => c.courseId.toString() === id,
      );
      if (course) {
        const completed = course.completedLectures?.some(
          (lectureId: Types.ObjectId) =>
            lectureId.toString() === currentVideo._id,
        );
        setIsCompleted(completed || false);
      }
    }
  }, [currentVideo, user, id]);

  // Update your handleMarkCompleted function
  // const handleMarkCompleted = async () => {
  //   try {
  //     if (!currentVideo || !user?._id) return;

  //     const result = await markAsCompleted({
  //       userId: user._id,
  //       courseId: id,
  //       lectureId: currentVideo._id
  //     }).unwrap();

  //     setIsCompleted(result.isCompleted);
  //     refetchUser();
  //     toast.success(result.message || 'Lecture status updated');
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || 'Failed to update lecture status');
  //   }
  // };

  // Tab content rendering
  const renderTabContent = () => {
    if (!currentVideo) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className=" dark:text-gray-100">
              {currentVideo?.description || "No description available"}
            </p>
          </div>
        );

      case "resources":
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Resources</h3>
            {currentVideo?.links?.length > 0 ? (
              <ul className="space-y-2">
                {currentVideo.links.map((link: any, index: number) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" hover:underline"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No resources available for this video
              </p>
            )}
          </div>
        );

      case "qna":
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Questions & Answers</h3>
            <div className="mb-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
              <button
                onClick={handleAddQuestion}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Post Question
              </button>
            </div>

            <div className="space-y-4">
              {currentVideo?.questions?.length > 0 ? (
                currentVideo.questions.map((q: any) => (
                  <div
                    key={q._id}
                    className="p-4 bg-gray-200 text-gray-800 rounded-lg shadow dark:bg-gray-700 dark:text-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Image
                          src={q.user?.avatar?.url || avatarIcon}
                          alt={q.user?.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium">{q.user?.name}</h4>
                            {(q.user?.role === "admin" ||
                              q.user?.role === "teacher") && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(q.createdAt).toLocaleString()}
                          </p>
                          <p className="mt-2">{q.question}</p>
                        </div>
                      </div>

                      {/* Reply button positioned at top right */}
                      <button
                        onClick={() => {
                          setReplyingToQuestionId(q._id);
                          setQuestionReplyInput("");
                        }}
                        className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 flex items-center group relative"
                        title="Reply to this question"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="absolute right-full mr-2 hidden group-hover:block whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded">
                          Reply
                        </span>
                      </button>
                    </div>

                    {q.questionReplies?.length > 0 && (
                      <div className="mt-3 ml-12">
                        <button
                          onClick={() => toggleQuestionReplies(q._id)}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {expandedQuestions[q._id]
                            ? "Hide answers"
                            : `Show answers (${q.questionReplies.length})`}
                        </button>

                        {expandedQuestions[q._id] && (
                          <div className="mt-2 space-y-3">
                            {q.questionReplies.map(
                              (reply: any, index: number) => (
                                <div
                                  key={`reply-${q._id}-${index}`}
                                  className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                      <Image
                                        src={
                                          reply.user?.avatar?.url || avatarIcon
                                        }
                                        alt={reply.user?.name}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full"
                                      />
                                      <div>
                                        <div className="flex items-center">
                                          <h4 className="font-medium">
                                            {reply.user?.name}
                                          </h4>
                                          {(reply.user?.role === "admin" ||
                                            reply.user?.role === "teacher") && (
                                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                              Verified
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          {new Date(
                                            reply.createdAt,
                                          ).toLocaleString()}
                                        </p>
                                        <p className="mt-1">{reply.reply}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reply form */}
                    {replyingToQuestionId === q._id && (
                      <div className="mt-3 ml-12">
                        <div className="flex flex-col gap-2">
                          <textarea
                            placeholder="Write your reply..."
                            className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                            rows={2}
                            value={questionReplyInput}
                            onChange={(e) =>
                              setQuestionReplyInput(e.target.value)
                            }
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReplyToQuestion(q._id)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Post Reply
                            </button>
                            <button
                              onClick={() => setReplyingToQuestionId(null)}
                              className="px-3 py-1 bg-gray-300 dark:bg-gray-500 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No questions yet. Be the first to ask!
                </p>
              )}
            </div>
          </div>
        );

      case "reviews":
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Reviews</h3>

            {/* Add review form - available to all users */}
            <div className="mb-6 p-4 bg-gray-200 text-gray-800 rounded-lg shadow dark:bg-gray-700 dark:text-gray-100">
              <h4 className="font-medium mb-2">Add your review</h4>
              <div className="flex items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    {star <= reviewRating ? (
                      <FaStar className="text-yellow-400" />
                    ) : (
                      <FaStar className="text-gray-300 dark:text-gray-500" />
                    )}
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {reviewRating > 0
                    ? `${reviewRating} star${reviewRating > 1 ? "s" : ""}`
                    : "Rate this video"}
                </span>
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your review..."
                className="w-full p-3 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                rows={3}
              />
              <button
                onClick={handleAddReview}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit Review
              </button>
            </div>

            {/* Reviews list */}
            <div className="space-y-4">
              {currentVideo?.reviews?.length > 0 ? (
                currentVideo.reviews.map((review: any) => (
                  <div
                    key={review._id}
                    className="p-4 bg-gray-200 text-gray-800 rounded-lg shadow dark:bg-gray-700 dark:text-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Image
                          src={review.user.avatar?.url || avatarIcon}
                          alt={review.user.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium">{review.user.name}</h4>
                            {(review.user.role === "admin" ||
                              review.user.role === "teacher") && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400">
                                {i < review.rating ? (
                                  <FaStar />
                                ) : (
                                  <FaStar className="opacity-30" />
                                )}
                              </span>
                            ))}
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-2">{review.comment}</p>
                        </div>
                      </div>

                      {/* Reply button positioned at top right */}
                      <button
                        onClick={() => {
                          setReplyingToReviewId(review._id);
                          setReplyInput("");
                        }}
                        className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 flex items-center group relative"
                        title="Reply to this review"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="absolute right-full mr-2 hidden group-hover:block whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded">
                          Reply
                        </span>
                      </button>
                    </div>

                    {review.commentReplies?.length > 0 && (
                      <div className="mt-3 ml-12">
                        <button
                          onClick={() => toggleReviewReplies(review._id)}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {expandedReviews[review._id]
                            ? "Hide replies"
                            : `Show replies (${review.commentReplies.length})`}
                        </button>

                        {expandedReviews[review._id] && (
                          <div className="mt-2 space-y-3">
                            {review.commentReplies.map((reply: any) => (
                              <div
                                key={`comment-reply-${reply._id}`}
                                className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start gap-3">
                                    <Image
                                      src={
                                        reply.user?.avatar?.url || avatarIcon
                                      }
                                      alt={reply.user?.name}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                      <div className="flex items-center">
                                        <h4 className="font-medium">
                                          {reply.user.name}
                                        </h4>
                                        {(reply.user.role === "admin" ||
                                          reply.user.role === "teacher") && (
                                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                            Verified
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(
                                          reply.createdAt,
                                        ).toLocaleString()}
                                      </p>
                                      <p className="mt-1">{reply.reply}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reply form */}
                    {replyingToReviewId === review._id && (
                      <div className="mt-3 ml-12">
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={replyInput}
                            onChange={(e) => setReplyInput(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddReply(review._id)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Submit
                            </button>
                            <button
                              onClick={() => setReplyingToReviewId(null)}
                              className="px-3 py-1 bg-gray-300 dark:bg-gray-500 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div
        className={`w-full min-h-screen flex items-center justify-center mt-15 ${theme === "dark" ? "bg-gray-400" : "bg-white"}`}
      >
        <Loader />
      </div>
    );
  }

  if (!groupedContent || groupedContent.length === 0) {
    return (
      <div
        className={`w-full min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-400" : "bg-white"}`}
      >
        <div className="text-center">
          <h2
            className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}
          >
            Course content not found
          </h2>
          <button
            onClick={() => router.push("/courses")}
            className={`mt-6 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const videoDuration = currentVideo?.videoLength
    ? formatDuration(currentVideo.videoLength)
    : "N/A";

  return (
    <div className={`w-full min-h-screen mt-5}`}>
      <Heading
        title={`${groupedContent[activeSection]?.videoSection || "Course"} - ${currentVideo?.title || "Video"}`}
        description="Access your purchased course content"
        keywords={groupedContent[activeSection]?.videoSection || "course"}
      />

      <div className="w-[90%] 800px:w-[85%] m-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Video Player and Content */}
          <div className="lg:w-3/4">
            {/* Video Player Section */}
            <h1
              className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              {currentVideo?.title || "Untitled Video"}
            </h1>
            <div
              className={`rounded-xl overflow-hidden shadow-lg mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
            >
              <div className="w-full">
                {currentVideo?.videoUrl?.url && (
                  <div className="w-full relative">
                    {isLoadingVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    <CoursePlayer
                      key={`${currentVideo._id}-${activeVideo}`}
                      title={currentVideo.title || "Course Video"}
                      videoUrl={currentVideo.videoUrl.url}
                      onLoadStart={handleVideoLoadStart}
                      onLoaded={handleVideoLoaded}
                    />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1
                    className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
                  >
                    {currentVideo?.title || "Untitled Video"}
                  </h1>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLikeVideo}
                      className={`flex items-center gap-1 ${liked ? "text-blue-500" : theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {liked ? (
                        <FaThumbsUp className="text-blue-500" />
                      ) : (
                        <FaRegThumbsUp />
                      )}
                      <span>{currentVideo?.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={handleDislikeVideo}
                      className={`flex items-center gap-1 ${disliked ? "text-red-500" : theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {disliked ? (
                        <FaThumbsDown className="text-red-500" />
                      ) : (
                        <FaRegThumbsDown />
                      )}
                      <span>{currentVideo?.dislikes?.length || 0}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <FiClock />
                    <span>{videoDuration}</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <FiCheckCircle />
                    <span>
                      {user?.completedLectures?.includes(currentVideo?._id)
                        ? "Completed"
                        : "Not Completed"}
                    </span>
                  </div>
                </div>

                {/* Navigation Buttons - Top */}
                <div className="flex justify-between mb-6">
                  <button
                    onClick={() => navigateVideo("prev")}
                    disabled={activeSection === 0 && activeVideo === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeSection === 0 && activeVideo === 0
                        ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    Previous
                  </button>
                  {/* <button
                    onClick={handleMarkCompleted}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isCompleted
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                      }`}
                  >
                    {isCompleted ? (
                      <div className="flex items-center gap-2">
                        <FiCheckCircle className="text-white" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      'Mark as Completed'
                    )}
                  </button> */}

                  <button
                    onClick={() => navigateVideo("next")}
                    disabled={
                      activeSection === groupedContent.length - 1 &&
                      activeVideo ===
                        groupedContent[activeSection].videos.length - 1
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeSection === groupedContent.length - 1 &&
                      activeVideo ===
                        groupedContent[activeSection].videos.length - 1
                        ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>

                {/* Tabs Navigation */}
                <div
                  className={`mt-4  rounded-lg ${theme === "dark" ? "bg-gray-500/50 text-gray-100" : "bg-gray-200 text-gray-900"}`}
                >
                  {/* Improved Tabs Navigation */}
                  <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {["overview", "resources", "qna", "reviews"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 font-medium text-sm capitalize transition-colors duration-200 ${
                          activeTab === tab
                            ? theme === "dark"
                              ? "text-white border-b-2 border-blue-500 bg-gray-800/50"
                              : "text-black border-b-2 border-blue-500 bg-gray-100"
                            : theme === "dark"
                              ? "text-gray-200 hover:text-white hover:bg-gray-900/30"
                              : "text-gray-600 hover:text-black hover:bg-gray-100"
                        }`}
                      >
                        {tab.replace("qna", "Q&A")}
                      </button>
                    ))}
                  </div>

                  {/* Improved Tab Content Container */}
                  <div
                    className={`p-4 rounded-b-lg ${
                      theme === "dark"
                        ? "bg-gray-600/50 text-gray-100"
                        : "bg-gray-50 text-gray-800"
                    } shadow-inner`}
                  >
                    {renderTabContent()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Course Content Navigation */}
          <div className="lg:w-1/4 mt-8">
            <div
              className={`rounded-xl shadow-lg sticky top-24 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3
                  className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
                >
                  Course Content
                </h3>
                <p
                  className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  {groupedContent.length} sections
                </p>
              </div>

              <div className="max-h-[70vh] overflow-y-auto">
                {groupedContent.map((section: any, sectionIndex: number) => (
                  <div
                    key={section.videoSection}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <div
                      className={`p-3 cursor-pointer flex justify-between items-center ${
                        activeSection === sectionIndex
                          ? theme === "dark"
                            ? "bg-gray-600"
                            : "bg-gray-200"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveSection(sectionIndex);
                        setActiveVideo(0);
                      }}
                    >
                      <span
                        className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}
                      >
                        {section.videoSection}
                      </span>
                      <span className="text-xs text-gray-500">
                        {section.videos?.length || 0} videos
                      </span>
                    </div>

                    {activeSection === sectionIndex && (
                      <div className="pl-4 pr-2 pb-2">
                        {section.videos?.map(
                          (video: any, videoIndex: number) => (
                            <motion.div
                              key={video._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className={`p-2 rounded-md cursor-pointer flex items-center gap-2 mb-1 ${
                                activeVideo === videoIndex
                                  ? theme === "dark"
                                    ? "bg-blue-900/30"
                                    : "bg-blue-100"
                                  : theme === "dark"
                                    ? "hover:bg-gray-700"
                                    : "hover:bg-gray-100"
                              }`}
                              onClick={() => setActiveVideo(videoIndex)}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  user?.completedLectures?.includes(video._id)
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              />
                              <span
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-700"
                                }`}
                              >
                                {video.title}
                              </span>
                              <span className="text-xs text-gray-500 ml-auto">
                                {formatDuration(video.videoLength)}
                              </span>

                              <FiUnlock className="text-green-500 ml-2" />
                            </motion.div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAccess;
