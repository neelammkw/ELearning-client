"use client";
import React, { useState, useEffect } from "react";
import Heading from "@/app/utils/Heading";
import Header from "@/app/components/Header";
import CourseCard from "@/app/components/Route/CourseCard";
import Footer from "@/app/components/Route/Footer";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Loader from "@/app/components/Loader/Loader";
import { motion } from "framer-motion";

const Page = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("title")?.toLowerCase() || "";
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: coursesData, isLoading } = useGetAllCoursesQuery({});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(1);
  const [route, setRoute] = useState("Login");

  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

  // Extract and normalize categories
  const getCategories = () => {
    // Get categories from courses
    const courseCategories =
      coursesData?.flatMap((course) => {
        if (!course.categories) return [];
        return course.categories.split(",").map((c) => c.trim());
      }) || [];

    // Get categories from layout
    const layoutCategories =
      categoriesData?.layout?.categories?.map((c) => c.title?.trim()) || [];

    // Combine and deduplicate
    return [
      "All",
      ...new Set([...layoutCategories, ...courseCategories].filter(Boolean)),
    ];
  };

  const allCategories = getCategories();

  useEffect(() => {
    if (!coursesData) return;

    let result = [...coursesData];

    // Apply category filter
    if (activeCategory !== "All") {
      result = result.filter((course) => {
        if (!course.categories) return false;
        const categories = course.categories.split(",").map((c) => c.trim());
        return categories.includes(activeCategory);
      });
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter((course) => {
        const searchFields = [
          course.name,
          course.description,
          course.tags,
          course.categories,
        ]
          .filter(Boolean)
          .map((f) => f.toLowerCase());

        return searchFields.some((field) => field.includes(searchQuery));
      });
    }

    setFilteredCourses(result);
  }, [coursesData, activeCategory, searchQuery]);

  return (
    <div
      className={`min-h-screen hero-animation ${
        theme === "dark"
          ? "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}
    >
      <Heading
        title={searchQuery ? `Search: ${searchQuery}` : "All Courses"}
        description={
          searchQuery
            ? `Results for "${searchQuery}"`
            : "Explore our wide range of courses"
        }
        keywords="courses, learning, education"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />

      {isLoading ? (
        <Loader />
      ) : (
        <div
          className={`min-h-[80vh] mt-20  hero-animation ${
            theme === "dark"
              ? "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
              : "bg-gradient-to-br from-blue-50 to-purple-50"
          }`}
        >
          {/* Animated Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1
              className={`text-4xl md:text-5xl  font-bold mb-6 ${
                theme === "dark" ? "text-gray-200" : "text-black"
              } text-center`}
            >
              Explore Our{" "}
              <span className="text-blue-600 dark:text-blue-400">Courses</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the perfect course to advance your skills and knowledge.
            </p>
          </motion.div>

          <div className="container mx-auto px-4 py-8">
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <h2
                  className={`text-xl font-semibold ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Search results for:{" "}
                  <span className="text-blue-500">
                    &quot;{searchQuery}&quot;
                  </span>
                </h2>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {filteredCourses.length}{" "}
                  {filteredCourses.length === 1 ? "course" : "courses"} found
                </p>
              </motion.div>
            )}

            {/* Animated Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-3 mb-8 justify-center"
            >
              {allCategories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-600 text-white"
                      : theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-white hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>

            {/* Animated Courses Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course, index) => {
                  return (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                    >
                      <CourseCard course={course} />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <h3
                  className={`text-xl font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {searchQuery
                    ? `No courses found for "${searchQuery}"`
                    : `No courses found in ${activeCategory} category`}
                </h3>
                <motion.div
                  className="flex gap-4 justify-center mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveCategory("All");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`px-4 py-2 rounded-md ${
                      theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                  >
                    View All Courses
                  </motion.button>
                  {searchQuery && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => (window.location.href = "/courses")}
                      className={`px-4 py-2 rounded-md ${
                        theme === "dark"
                          ? "bg-gray-600 hover:bg-gray-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Clear Search
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Animated Footer Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Footer />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Page;
