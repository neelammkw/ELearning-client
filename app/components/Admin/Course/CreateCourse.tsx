"use client";
import React, { useState, useEffect } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useTheme } from "next-themes";
import { useCreateCourseMutation } from "@/redux/features/courses/coursesApi";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";

const CreateCourse = () => {
  const [createCourse, { isLoading, isSuccess, error }] =
    useCreateCourseMutation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [active, setActive] = useState(0);

  // State for form data
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    categories: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: null as File | null,
    thumbnail: null as File | null,
  });

  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: null as File | null,
      title: "",
      description: "",
      videoSection: "",
      videoLength: "",
      links: [{ title: "", url: "" }],
      suggestion: "",
    },
  ]);
  const [courseDatas, setCourseDatas] = useState({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const previewData = {
      name: courseInfo.name,
      description: courseInfo.description,
      categories: courseInfo.categories,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl
        ? URL.createObjectURL(courseInfo.demoUrl)
        : "",
      thumbnail: courseInfo.thumbnail
        ? URL.createObjectURL(courseInfo.thumbnail)
        : "",
      benefits: benefits.filter((b) => b.title.trim() !== ""),
      prerequisites: prerequisites.filter((p) => p.title.trim() !== ""),
      courseData: courseContentData.map((content) => ({
        title: content.title,
        description: content.description,
        videoSection: content.videoSection,
        videoLength: content.videoLength,
        videoUrl: content.videoUrl ? URL.createObjectURL(content.videoUrl) : "",
        links: content.links.filter(
          (l) => l.title.trim() !== "" && l.url.trim() !== "",
        ),
        suggestion: content.suggestion,
      })),
    };

    setCourseDatas(previewData);
    setActive(3); // Move to preview page
  };

  const handleCourseCreate = async () => {
    try {
      // Validate required fields
      if (!courseInfo.name || !courseInfo.description || !courseInfo.price) {
        toast.error("Please fill all required fields");
        return;
      }

      const formData = new FormData();

      // Prepare course data (without files)
      const courseJson = {
        name: courseInfo.name,
        description: courseInfo.description,
        categories: courseInfo.categories,
        price: courseInfo.price,
        estimatedPrice: courseInfo.estimatedPrice || "0",
        tags: courseInfo.tags,
        level: courseInfo.level,
        benefits: benefits.filter((b) => b.title.trim() !== ""),
        prerequisites: prerequisites.filter((p) => p.title.trim() !== ""),
        courseData: courseContentData.map((content) => ({
          title: content.title,
          description: content.description,
          videoSection: content.videoSection,
          videoLength: content.videoLength,
          links: content.links.filter(
            (l) => l.title.trim() !== "" && l.url.trim() !== "",
          ),
          suggestion: content.suggestion,
        })),
      };

      // Append JSON data
      formData.append("courseData", JSON.stringify(courseJson));

      if (courseInfo.thumbnail) {
        formData.append("thumbnail", courseInfo.thumbnail);
      } else {
        console.warn("No thumbnail file found");
      }

      // 3. Append demoUrl (CRITICAL FIX)
      if (courseInfo.demoUrl) {
        formData.append("demoUrl", courseInfo.demoUrl);
      } else {
        console.warn("No demoUrl file found");
      }

      // Append video files
      courseContentData.forEach((content, index) => {
        if (content.videoUrl instanceof File) {
          formData.append(`video_${index}`, content.videoUrl);
        }
      });

      await createCourse(formData);
    } catch (err) {
      console.error("Error creating course:", err);
      toast.error("Error creating course");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course Created successfully");
      redirect("/admin/courses");
    }
    if (error) {
      console.error("Course creation error:", error);
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isLoading, isSuccess, error]);

  return (
    <div
      className={`w-full flex flex-col lg:flex-row min-h-screen rounded-lg ${isDark ? "bg-gray-700 text-white" : "text-black"}`}
    >
      {/* Sidebar - will appear above content on mobile */}
      <div className="w-full lg:w-[20%]  lg:right-0 lg:top-0 lg:h-full lg:mt-[60px] p-2 lg:p-0 bg-transparent lg:bg-inherit">
        <CourseOptions active={active} setActive={setActive} />
      </div>
      {/* Main content area - full width on mobile */}
      <div className="w-full lg:w-[80%] p-4">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseDatas={{
              name: courseInfo.name,
              description: courseInfo.description,
              categories: courseInfo.categories,
              price: courseInfo.price,
              estimatedPrice: courseInfo.estimatedPrice,
              tags: courseInfo.tags.split(",").map((tag) => tag.trim()),
              level: courseInfo.level,
              demoUrl: courseInfo.demoUrl,
              thumbnail: courseInfo.thumbnail,
              benefits: benefits.filter((b) => b.title.trim() !== ""),
              prerequisites: prerequisites.filter((p) => p.title.trim() !== ""),
              courseData: courseContentData.map((content) => ({
                title: content.title,
                description: content.description,
                videoSection: content.videoSection,
                videoLength: content.videoLength,
                videoUrl: content.videoUrl,
                links: content.links.filter(
                  (l) => l.title.trim() !== "" && l.url.trim() !== "",
                ),
                suggestion: content.suggestion,
              })),
            }}
            handleCourseCreate={handleCourseCreate}
            isLoading={isLoading}
          />
        )}
      </div>


    </div>
  );
};

export default CreateCourse;
