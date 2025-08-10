"use client";
import React, { FC } from "react";
import { useGetUserCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../Loader/Loader";
import CourseCard from "./CourseCard"; // Make sure this path is correct
import { useTheme } from "next-themes";

const EnrolledCourses: FC = () => {
  const { theme } = useTheme();
  const { data: response, isLoading, isError } = useGetUserCoursesQuery({});
  const courses = response || []; // Access the courses array from response

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div
        className={`w-full text-center py-12 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
      >
        <p className="text-lg">Error loading your courses.</p>
        <p className="mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Your Enrolled Courses</h2>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg">You haven't enrolled in any courses yet.</p>
            <p className="mt-2">Browse our courses to get started!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: ICourse) => (
                <div key={course._id} className="relative">
                  <CourseCard
                    course={course}
                    isProfile={true}
                    isEnrolled={true}
                  />
                  {/* Progress indicator overlay */}
                  <div className="absolute top-4 left-4 right-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2 z-10">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 ">
              <h3 className="text-xl font-semibold mb-4 ">Learning Progress</h3>
              <div className="space-y-4 text-gray-700">
                {courses.map((course: ICourse) => (
                  <div
                    key={course._id}
                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{course.name}</h4>
                      <span className="text-sm text-gray-800 dark:text-gray-800">
                        {course.progress || 0}% complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;
