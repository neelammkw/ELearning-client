import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import avatarIcon from "../../../public/assets/avatar.png";
import {
  useAddCourseReviewMutation,
  useReplyToCourseReviewMutation,
  useGetCourseReviewsQuery,
} from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";

const ReviewsSection = ({ course, user }: { course: any; user: any }) => {
  const { theme } = useTheme();
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  const [replyingToReviewId, setReplyingToReviewId] = useState<string | null>(
    null,
  );
  const [replyInput, setReplyInput] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  // API calls
  const [addCourseReview] = useAddCourseReviewMutation();
  const [replyToCourseReview] = useReplyToCourseReviewMutation();
  const { data: reviewsData, refetch: refetchReviews } =
    useGetCourseReviewsQuery(course._id);

  const reviews = reviewsData?.reviews || course.reviews || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
      return `${interval} year${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return `${interval} month${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return `${interval} hour${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return `${interval} minute${interval === 1 ? "" : "s"} ago`;

    return `${Math.floor(seconds)} second${seconds === 1 ? "" : "s"} ago`;
  };

  const toggleReviewReplies = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };
  useEffect(() => {
    console.log("Reviews data:", reviewsData);
    if (reviewsData?.reviews) {
      reviewsData.reviews.forEach(review => {
        console.log(`Review ${review._id} replies:`, review.commentReplies);
      });
    }
  }, [reviewsData]);

  const handleReviewSubmit = async () => {
    if (!reviewRating) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      await addCourseReview({
        courseId: course._id,
        rating: reviewRating,
        comment: reviewComment,
      }).unwrap();

      setReviewRating(0);
      setReviewComment("");
      setShowReviewForm(false);
      refetchReviews();
      toast.success("Review submitted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyInput.trim()) {
      toast.error("Please write a reply");
      return;
    }

    try {
      await replyToCourseReview({
        courseId: course._id,
        reviewId,
        reply: replyInput,
      }).unwrap();

      setReplyInput("");
      setReplyingToReviewId(null);
      refetchReviews();
      toast.success("Reply added successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add reply");
    }
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"} `}
        >
          Reviews
        </h2>
        {!showReviewForm && user && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Review
          </button>
        )}
      </div>

      {/* Add review form */}
      {showReviewForm && (
        <div
          className={`mb-8 p-6 rounded-lg ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Write Your Review</h3>
            <button
              onClick={() => {
                setShowReviewForm(false);
                setReviewRating(0);
                setReviewComment("");
              }}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setReviewRating(star)}
                className="text-2xl focus:outline-none mr-1"
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
                : "Select rating"}
            </span>
          </div>

          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your detailed thoughts about this course..."
            className="w-full p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            rows={4}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                setShowReviewForm(false);
                setReviewRating(0);
                setReviewComment("");
              }}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleReviewSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review: any) => (
            <div
              key={review._id}
              className={`p-6 rounded-lg shadow ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-200"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <Image
                    src={review.user?.avatar?.url || avatarIcon}
                    alt={review.user?.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-semibold">{review.user?.name}</h4>
                      {(review.user?.role === "admin" ||
                        review.user?.role === "teacher") && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                            Instructor
                          </span>
                        )}
                    </div>

                    <div className="flex items-center mt-1">
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
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <p
                      className={`mt-2 ${theme === "dark" ? " text-gray-100" : "text-gray-600"}`}
                    >
                      {review.comment}
                    </p>
                  </div>
                </div>

                {/* Reply button */}
                {user && (
                  <button
                    onClick={() => {
                      setReplyingToReviewId(
                        replyingToReviewId === review._id ? null : review._id,
                      );
                      setReplyInput("");
                    }}
                    className={`p-2 rounded-full ${replyingToReviewId === review._id
                      ? "bg-blue-100 text-blue-600 dark:bg-gray-700"
                      : "text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700"
                      }`}
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
                  </button>
                )}
              </div>

              {/* Replies section */}
              {review.commentReplies?.length > 0 && (
                <div className="mt-4 ml-16">
                  <button
                    onClick={() => toggleReviewReplies(review._id)}
                    className="text-sm text-blue-500 hover:underline mb-2 flex items-center"
                  >
                    {expandedReviews[review._id] ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        Hide replies
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                        Show replies ({review.commentReplies.length})
                      </>
                    )}
                  </button>

{expandedReviews[review._id] && (
                    <div className="space-y-4 mt-2">
                      {review.commentReplies.map((reply: any) => {
                        const replyUser = getReplyUser(reply);
                        return (
                          <div
                            key={reply._id || reply.createdAt}
                            className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
                          >
                            <div className="flex items-start gap-3">
                              <Image
                                src={replyUser.avatar?.url || avatarIcon}
                                alt={replyUser.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="flex items-center">
                                  <h5 className="font-medium">
                                    {replyUser.name}
                                  </h5>
                                  {(replyUser.role === "admin" || replyUser.role === "teacher") && (
                                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                      Instructor
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(reply.createdAt)}
                                </p>
                                <p className={`mt-1 ${theme === "dark" ? "text-gray-100" : "text-gray-600"}`}>
                                  {reply.reply || reply.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Reply form */}
              {replyingToReviewId === review._id && (
                <div className="mt-4 ml-16">
                  <textarea
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setReplyingToReviewId(null)}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReplySubmit(review._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            className={`text-center py-8 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <p className="text-gray-500 dark:text-gray-400">
              No reviews yet. Be the first to review this course!
            </p>
            {!showReviewForm && user && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Write a Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
