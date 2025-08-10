"use client";
import React, { useState, useEffect, FC } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useTheme } from "next-themes";
import {
  useUpdateCourseMutation,
  useGetCourseQuery,
} from "@/redux/features/courses/coursesApi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "../../Loader/Loader";

type Props = {
  id: string;
};

const EditCourse: FC<Props> = ({ id }) => {
  const router = useRouter();
  const {
    data,
    isLoading: isFetching,
    error: fetchError,
  } = useGetCourseQuery(id);
  const [updateCourse, { isLoading, isSuccess, error }] =
    useUpdateCourseMutation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [active, setActive] = useState(0);

  // State for form data
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    categories: "", // Added categories
    level: "",
    demoUrl: null as File | string | null,
    thumbnail: null as File | string | null,
  });

  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: null as File | string | null,
      title: "",
      description: "",
      videoSection: "",
      videoLength: 0, // Added videoLength
      links: [{ title: "", url: "" }],
      suggestion: "",
    },
  ]);

  // Load course data when component mounts
  // Update the useEffect that loads course data
  useEffect(() => {
    if (data?.course) {
      const course = data.course;

      setCourseInfo({
        name: course.name,
        description: course.description,
        price: course.price,
        estimatedPrice: course.estimatedPrice || "",
        tags: course.tags,
        categories: course.categories || "",
        level: course.level,
        demoUrl: course.demoUrl?.url || null,
        thumbnail: course.thumbnail?.url || null,
      });

      setBenefits(course.benefits || [{ title: "" }]);
      setPrerequisites(course.prerequisites || [{ title: "" }]);

      if (course.courseData) {
        const normalizedContentData = course.courseData.map((content: any) => {
          // Properly handle videoUrl structure
          let videoUrl = content.videoUrl;
          if (typeof videoUrl === "string") {
            videoUrl = {
              url: videoUrl,
              public_id: content.videoUrl?.public_id || "",
            };
          } else if (!videoUrl) {
            videoUrl = { url: "", public_id: "" };
          }

          return {
            _id: content._id,
            videoUrl, // Now properly structured
            title: content.title,
            description: content.description,
            videoSection: content.videoSection,
            videoLength: content.videoLength || 0,
            links: content.links || [{ title: "", url: "" }],
            suggestion: content.suggestion || "",
          };
        });

        setCourseContentData(normalizedContentData);
      }
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActive(3); // Move to preview page
  };

  // Update the handleCourseUpdate function:
  const handleCourseUpdate = async () => {
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
        price: courseInfo.price,
        estimatedPrice: courseInfo.estimatedPrice || "0",
        tags: courseInfo.tags,
        categories: courseInfo.categories,
        level: courseInfo.level,
        benefits: benefits.filter((b) => b.title.trim() !== ""),
        prerequisites: prerequisites.filter((p) => p.title.trim() !== ""),
        courseData: courseContentData.map((content, index) => {
          // Preserve existing videoUrl if no new file is uploaded
          const videoUrlToSend = content.videoFile
            ? undefined // Will be handled by file upload
            : content.videoUrl?.url
              ? content.videoUrl.url
              : undefined;

          return {
            _id: content._id,
            title: content.title,
            description: content.description,
            videoSection: content.videoSection,
            videoLength: content.videoLength || 0,
            links: content.links.filter(
              (l) => l.title.trim() !== "" && l.url.trim() !== "",
            ),
            suggestion: content.suggestion,
            videoUrl: videoUrlToSend,
          };
        }),
      };

      // Append JSON data
      formData.append("courseData", JSON.stringify(courseJson));

      // Handle thumbnail
      if (courseInfo.thumbnail instanceof File) {
        formData.append("thumbnail", courseInfo.thumbnail);
      }

      // Handle demoUrl
      if (courseInfo.demoUrl instanceof File) {
        formData.append("demoUrl", courseInfo.demoUrl);
      }

      // Handle video files
      courseContentData.forEach((content, index) => {
        if (content.videoFile instanceof File) {
          formData.append(`video_${index}`, content.videoFile);
        }
      });

      for (const [key, value] of formData.entries()) {
      }

      await updateCourse({ id, data: formData });
    } catch (err) {
      console.error("Error updating course:", err);
      toast.error("Error updating course");
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("Course Updated successfully");
      router.push("/admin/courses");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error, router]);

  if (isFetching) {
    return <Loader />;
  }

  if (fetchError) {
    return <div>Error loading course data</div>;
  }

  return (
    <div
      className={`w-full flex flex-col lg:flex-row min-h-screen rounded-lg ${isDark ? "bg-gray-700 text-white" : "text-black"}`}
    >
      {/* Main content area - full width on mobile */}
      <div className="w-full lg:w-[80%] p-4">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
            isEdit={true}
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
            isEdit={true}
          />
        )}
        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
            isEdit={true}
          />
        )}
        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseDatas={{
              name: courseInfo.name,
              description: courseInfo.description,
              price: courseInfo.price,
              estimatedPrice: courseInfo.estimatedPrice,
              tags: courseInfo.tags,
              categories: courseInfo.categories, // Added categories
              level: courseInfo.level,
              demoUrl: courseInfo.demoUrl,
              thumbnail: courseInfo.thumbnail,
              benefits: benefits.filter((b) => b.title.trim() !== ""),
              prerequisites: prerequisites.filter((p) => p.title.trim() !== ""),
              courseData: courseContentData.map((content) => ({
                title: content.title,
                description: content.description,
                videoSection: content.videoSection,
                videoUrl: content.videoUrl,
                videoLength: content.videoLength || 0, // Added videoLength
                links: content.links.filter(
                  (l) => l.title.trim() !== "" && l.url.trim() !== "",
                ),
                suggestion: content.suggestion,
              })),
            }}
            handleCourseCreate={handleCourseUpdate}
            isLoading={isLoading}
            isEdit={true}
          />
        )}
      </div>
      {/* Sidebar - will appear below content on mobile */}
      <div className="w-full lg:w-[20%]  lg:right-0 lg:top-0 lg:h-full lg:mt-[60px] p-2 lg:p-0 bg-transparent lg:bg-inherit">
        <CourseOptions active={active} setActive={setActive} isEdit={true} />
      </div>
    </div>
  );
};

export default EditCourse;
