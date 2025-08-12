"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  FiClock,
  FiBarChart2,
  FiTag,
  FiBook,
  FiCheckCircle,
  FiLock,
} from "react-icons/fi";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import Loader from "../Loader/Loader";
import CourseContentList from "./CourseContentList";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CoursePlayer from "@/app/utils/CoursePlayer";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishableKeyQuery,
} from "@/redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";
import PaymentModal from "./PaymentModal";
import {
  useGetCourseQuery,
  useCheckCourseEnrollmentQuery,
} from "@/redux/features/courses/coursesApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ReviewsSection from "./ReviewSection";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
type Props = {
  id: string;
};

const CourseDetail = ({ id }: Props) => {
  const { data, isLoading, error } = useGetCourseQuery(id);
  const { data: userData, refetch: refetchUser } = useLoadUserQuery(
    undefined,
    {},
  );
  const { theme } = useTheme();
  const router = useRouter();
  const [activeVideo, setActiveVideo] = useState(0);
  const [createPaymentIntent, { isLoading: paymentLoading }] =
    useCreatePaymentIntentMutation();
  const { data: config } = useGetStripePublishableKeyQuery({});
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const user = userData?.user?._id;
  const {
    data: enrollmentData,
    isLoading: enrollmentLoading,
    isError: enrollmentError,
    error: enrollmentQueryError,
    refetch: refetchEnrollment,
  } = useCheckCourseEnrollmentQuery(id, { skip: !userData?.user?._id });

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showEnrollmentMessage, setShowEnrollmentMessage] = useState(false);

  const course = data?.course;
  const discountPercentage =
    course?.estimatedPrice > 0
      ? Math.round(
          ((course.estimatedPrice - course.price) / course.estimatedPrice) *
            100,
        )
      : 0;

  // Check enrollment status when user or enrollment data changes
  useEffect(() => {
    if (enrollmentData) {
      setIsEnrolled(enrollmentData.isEnrolled);
      if (enrollmentData.isEnrolled) {
        setShowEnrollmentMessage(true);
      }
    }
  }, [enrollmentData]);

  // Refetch enrollment status when user loads
  useEffect(() => {
    if (userData?.user?._id) {
      refetchEnrollment();
    }
  }, [userData, refetchEnrollment]);

  // Initialize Stripe
  useEffect(() => {
    if (config?.publishableKey) {
      loadStripe(config.publishableKey).then((stripe) => {
        setStripePromise(stripe);
      });
    }
  }, [config]);

  const handleAccessCourse = () => {
    router.push(`/course-access/${course._id}`);
  };

  const handleBuyClick = async () => {
    if (!course) return;

    try {
      setPaymentError("");
      await createPaymentIntent({
        courseId: course._id,
      }).unwrap();
      setPaymentModalOpen(true);
    } catch (err) {
      console.error("Payment intent creation failed:", err);
      setPaymentError("Failed to initialize payment. Please Login.");
    }
  };

  const handleFreeEnrollment = async () => {
    if (!course || course.price > 0) return;

    try {
      const result = await enrollCourse(course._id).unwrap();
      if (result.success) {
        toast.success("Enrolled successfully!");
        refetchEnrollment();
        refetchUser(); // Refresh user data to get updated courses
      }
    } catch (error) {
      toast.error("Enrollment failed. Please try again.");
      console.error("Enrollment error:", error);
    }
  };
  // Inside your CourseDetail component, add this transformation
  const groupedCourseData =
    course?.courseData?.reduce((acc: any[], item: any) => {
      const sectionIndex = acc.findIndex(
        (section) => section.videoSection === item.videoSection,
      );

      if (sectionIndex === -1) {
        // New section
        acc.push({
          videoSection: item.videoSection,
          description: item.description || "",
          videos: [
            {
              ...item,
              _id: item._id,
            },
          ],
        });
      } else {
        // Existing section
        acc[sectionIndex].videos.push({
          ...item,
          _id: item._id,
        });
      }

      return acc;
    }, []) || [];
  const totalDuration =
    course?.courseData?.reduce((total: number, section: any) => {
      return (
        total +
        (section.videos?.reduce((sectionTotal: number, video: any) => {
          return sectionTotal + (video.videoLength || 0);
        }, 0) || 0)
      );
    }, 0) || 0;

  const totalVideos =
    course?.courseData?.reduce((total: number, section: any) => {
      return total + (section.videos?.length || 0);
    }, 0) || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${mins}m`;
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">Error loading course</div>
    );
  if (!course)
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Course not found
      </div>
    );

  return (
    <>
      <div
        className={`w-full mt-15 py-12 min-h-screen ${theme === "dark" ? "dark:bg-gray-900" : "bg-white"}`}
      >
        <div className="w-[90%] 800px:w-[85%] m-auto">
          {/* Enrollment Success Message */}
          {showEnrollmentMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex justify-between items-center">
              <span>You're already enrolled in this course!</span>
              <button
                onClick={() => setShowEnrollmentMessage(false)}
                className="font-bold text-lg"
              >
                U+00d7
              </button>
            </div>
          )}

          {/* Payment Error Message */}
          {paymentError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {paymentError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Course Header with Discount Badge */}

              <div className="lg:col-span-2">
                <motion.div variants={itemVariants} className="mb-4 md:mb-8">
                  <h1
                    className={`text-3xl 800px:text-4xl font-bold mb-2 md:mb-4 ${theme === "dark" ? "text-gray-400" : "text-black"}`}
                  >
                    {course.name}
                  </h1>

                  {/* Demo Video Player */}
                  {course.demoUrl?.url && (
                    <div className="mb-4 md:mb-6">
                      <div className="h-[320px] md:w-[500px] mx-auto mb-4 rounded-lg overflow-hidden">
                        <CoursePlayer
                          videoUrl={course.demoUrl.url}
                          title={`${course.name} - Preview`}
                        />
                      </div>
                      <p className="text-sm text-gray-500 text-center">
                        This is a preview of the course
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center space-x-0.5">
                        {[1, 2, 3, 4, 5].map((star, index) => (
                          <span
                            key={index}
                            className={
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }
                          >
                            {(course.ratings || 0) >= star ? (
                              <AiFillStar className="w-3.5 h-3.5 text-yellow-400" />
                            ) : (
                              <AiOutlineStar className="w-3.5 h-3.5" />
                            )}
                          </span>
                        ))}
                      </div>
                      <span
                        className={`ml-1 text-gray-600 dark:text-gray-300 text-xs`}
                      >
                        ({course.reviews?.length || 0} reviews)
                      </span>
                    </div>
                    {/* <div className="flex items-center gap-1">
                      {renderRatingStars(course.ratings || 0)}
                      <span className="ml-1 text-gray-600 dark:text-gray-300">
                        ({course.reviews?.length || 0} reviews)
                      </span>
                    </div> */}
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <FiClock />
                      <span>
                        Last updated:{" "}
                        {new Date(course.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Course Description */}
                  <div className="mb-8">
                    <h2
                      className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-gray-400" : "text-black"}`}
                    >
                      Course Description
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* What You'll Learn */}
                  {course.benefits?.length > 0 && (
                    <div
                      className={`mb-8 ${theme === "dark" ? "text-gray-400" : "text-black"} `}
                    >
                      <h2 className="text-2xl font-bold mb-4 dark:text-gray-300">
                        What you'll learn
                      </h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.benefits.map((benefit: any, index: number) => (
                          <motion.li
                            key={index}
                            className="flex items-start gap-2"
                            variants={itemVariants}
                          >
                            <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                            <span>{benefit.title}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>

                {/* Course Content Section */}
                <div
                  className={`mb-8 ${theme === "dark" ? "text-gray-400" : "text-black"}`}
                >
                  <h2 className="text-2xl font-bold mb-4 dark:text-white">
                    Course Content
                  </h2>

                  <div className="text-center py-4">
                    <CourseContentList
                      data={groupedCourseData}
                      activeVideo={activeVideo}
                      setActiveVideo={setActiveVideo}
                      user={userData?.user}
                      courseId={course._id}
                      isEnrolled={isEnrolled}
                    />
                    <button
                      onClick={
                        course.price > 0 ? handleBuyClick : handleFreeEnrollment
                      }
                      disabled={paymentLoading || enrollmentLoading}
                      className={`px-6 mt-5 py-3 ${
                        isEnrolled
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white rounded-lg transition duration-300 font-medium ${
                        paymentLoading || enrollmentLoading
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {paymentLoading
                        ? "Processing..."
                        : enrollmentLoading
                          ? "Checking access..."
                          : isEnrolled
                            ? "Continue Learning"
                            : course.price > 0
                              ? `Enroll Now for $${course.price}`
                              : "Enroll for Free"}
                    </button>
                  </div>
                </div>
                {/* {Review Section} */}
                <div>
                  <ReviewsSection course={course} user={userData?.user} />
                </div>
              </div>
            </div>
            {/* Right Column - Pricing Box */}
            <div className="lg:col-span-1">
              <div
                className={`p-6 rounded-xl shadow-lg sticky top-24 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
              >
                {/* Price with Discount */}
                <div className="mb-4">
                  {discountPercentage > 0 && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="line-through text-gray-500 dark:text-gray-400">
                        ${course.estimatedPrice}
                      </span>
                      <span className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded text-xs">
                        Save {discountPercentage}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Course Details */}
                <div className="lg:col-span-1">
                  <motion.div
                    variants={itemVariants}
                    className={`p-6 rounded-xl shadow-lg sticky top-24 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
                  >
                    {course.thumbnail?.url && (
                      <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={course.thumbnail.url}
                          alt={course.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                      ${course.price}
                    </div>

                    <button
                      onClick={isEnrolled ? handleAccessCourse : handleBuyClick}
                      disabled={paymentLoading || enrollmentLoading}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 mb-4 ${
                        theme === "dark"
                          ? isEnrolled
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                          : isEnrolled
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                      } ${
                        paymentLoading || enrollmentLoading
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {paymentLoading
                        ? "Processing..."
                        : enrollmentLoading
                          ? "Checking access..."
                          : isEnrolled
                            ? "Go to Course"
                            : "Buy Now"}
                    </button>
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      30-Day Money-Back Guarantee
                    </div>

                    <div className={`space-y-3 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      <div className="flex items-center gap-3">
                        <FiBarChart2 className="text-blue-500" />
                        <span>
                          Level:{" "}
                          <span className="font-medium capitalize">
                            {course.level}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiClock className="text-blue-500" />
                        <span>
                          Duration:{" "}
                          <span className="font-medium">
                            {formatDuration(totalDuration)}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiBook className="text-blue-500" />
                        <span>
                          Lessons:{" "}
                          <span className="font-medium">{totalVideos}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiTag className="text-blue-500" />
                        <span>
                          Category:{" "}
                          <span className="font-medium">
                            {course.categories}
                          </span>
                        </span>
                      </div>
                    </div>

                    {course.prerequisites?.length > 0 && (
                      <div className={`mt-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        <h4 className="font-bold mb-2 dark:text-white">
                          Prerequisites
                        </h4>
                        <ul className="space-y-2">
                          {course.prerequisites.map(
                            (prereq: any, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{prereq.title}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          stripePromise={stripePromise}
          course={course}
          router={router}
        />
      </div>
    </>
  );
};

export default CourseDetail;
