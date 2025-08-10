"use client";
import React, { FC } from "react";
import { useGetUserOrdersQuery } from "../../../redux/features/orders/ordersApi";
import Loader from "../Loader/Loader";
import { useTheme } from "next-themes";
import { formatDate } from "../../utils/dateUtils";
import Image from "next/image";
import Link from "next/link";

const PurchasedHistory: FC = () => {
  const { theme } = useTheme();
  const { data, isLoading, isError } = useGetUserOrdersQuery({});
  // Filter only completed orders and sort by date (newest first)
  const completedOrders = (data || [])
    .filter((order: any) => order.status === "completed")
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div
        className={`text-center py-12 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
      >
        <p className="text-lg">Error loading purchase history.</p>
        <p className="mt-2">Please try again later.</p>
      </div>
    );
  }

  // Calculate summary statistics
  const totalSpent = completedOrders.reduce(
    (sum: number, order: any) => sum + (order.payment_info?.amount || 0),
    0,
  );
  const lastPurchaseDate =
    completedOrders.length > 0
      ? formatDate(new Date(completedOrders[0].createdAt), "MMM dd, yyyy")
      : "N/A";

  return (
    <div
      className={`w-full ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Your Completed Purchases</h2>

        {completedOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg">No completed purchases found.</p>
            <p className="mt-2">Your completed courses will appear here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Orders List */}
            <div className="space-y-4">
              {completedOrders.map((order: any) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  } shadow-sm`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Course Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative w-20 h-12 flex-shrink-0 rounded-md overflow-hidden">
                        {order.courseId?.thumbnail ? (
                          <Image
                            src={
                              order.courseId.thumbnail.url ||
                              "/default-course.png"
                            }
                            alt={order.courseId.name || "Course thumbnail"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium line-clamp-1">
                          {order.courseId?.name || "Course not available"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Purchased on{" "}
                          {formatDate(
                            new Date(order.createdAt),
                            "MMM dd, yyyy",
                          )}
                        </p>
                        {order.courseId?.level && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                              theme === "dark"
                                ? "bg-blue-900 text-blue-200"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.courseId.level}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">
                          ${order.payment_info?.amount || "0.00"}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            order.payment_info?.status === "succeeded"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {order.courseId?._id ? (
                        <Link
                          href={`/course/${order.courseId._id}`}
                          className={`px-3 py-1.5 rounded-md text-sm text-center ${
                            theme === "dark"
                              ? "bg-blue-600 hover:bg-blue-500 text-white"
                              : "bg-gray-800 hover:bg-gray-700 text-white"
                          } transition-colors`}
                        >
                          Access Course
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1.5 rounded-md text-sm text-center bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        >
                          Course Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Purchase Summary */}
            <div
              className={`p-6 rounded-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">Purchase Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-white"
                  } shadow`}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {completedOrders.length}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-white"
                  } shadow`}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    ${(totalSpent / 100).toFixed(2)}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-white"
                  } shadow`}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last Purchase
                  </p>
                  <p className="text-lg mt-1">{lastPurchaseDate}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedHistory;
