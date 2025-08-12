"use client";
import { styles } from "@/app/styles/style";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useGetLayoutQuery } from "@/redux/features/layout/layoutApi";

interface Props {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
  isEdit?: boolean;
}

const CourseInformation: React.FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
  isEdit,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [dragging, setDragging] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [demoPreview, setDemoPreview] = useState<string | null>(null);

  // Fetch categories from database
  const { data: categoriesData } = useGetLayoutQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [categories, setCategories] = useState<{ title: string }[]>([]);

  useEffect(() => {
    if (categoriesData?.layout?.categories) {
      setCategories(categoriesData.layout.categories);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (isEdit) {
      if (courseInfo.thumbnail && typeof courseInfo.thumbnail === "string") {
        setThumbnailPreview(courseInfo.thumbnail);
      }
      if (courseInfo.demoUrl && typeof courseInfo.demoUrl === "string") {
        setDemoPreview(courseInfo.demoUrl);
      }
    }
  }, [isEdit, courseInfo.thumbnail, courseInfo.demoUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setThumbnailPreview(result);
      };
      reader.readAsDataURL(file);
      setCourseInfo({ ...courseInfo, thumbnail: file });
    } else if (isEdit && typeof courseInfo.thumbnail === "string") {
      setThumbnailPreview(courseInfo.thumbnail);
    }
  };

  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setDemoPreview(result);
      };
      reader.readAsDataURL(file);
      setCourseInfo({ ...courseInfo, demoUrl: file });
    } else if (isEdit && typeof courseInfo.demoUrl === "string") {
      setDemoPreview(courseInfo.demoUrl);
    }
  };

  const handleThumbnailDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setThumbnailPreview(result);
      };
      reader.readAsDataURL(file);
      setCourseInfo({ ...courseInfo, thumbnail: file });
    }
  };

  const handleDemoDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setDemoPreview(result);
      };
      reader.readAsDataURL(file);
      setCourseInfo({ ...courseInfo, demoUrl: file });
    }
  };

  const inputStyle = `${styles.input} ${isDark ? "bg-gray-900 text-white border-gray-200" : "bg-white text-black border-gray-300"}`;
  const labelStyle = `${styles.label} ${isDark ? "text-white" : "text-black"}`;
  const dropdownStyle = `${styles.input} ${isDark ? "bg-gray-900 text-black border-gray-200" : "bg-white text-black border-gray-300"}`;
  const divStyle = `mb-2 ${isDark ? "text-white" : "text-black"}`;

  return (
    <div className="w-[90%] m-auto mt-10 mr-15">
      <div
        className={`${isDark ? "text-white" : "text-black"} backdrop-blur-sm bg-opacity-50 ${isDark ? "bg-slate-800" : "bg-slate-100"} rounded-lg shadow-lg p-4 mb-6`}
      >
        <h3>
          Course Information
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Course Name */}
          <div className={divStyle}>
            <label htmlFor="courseName" className={labelStyle}>
              Course Name
            </label>
            <input
              id="courseName"
              type="text"
              placeholder="Enter course name"
              className={inputStyle}
              value={courseInfo?.name || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, name: e.target.value })
              }
              required
            />
          </div>

          {/* Course Description */}
          <div className={divStyle}>
            <label htmlFor="courseDescription" className={labelStyle}>
              Course Description
            </label>
            <textarea
              id="courseDescription"
              placeholder="Enter course description"
              className={inputStyle}
              value={courseInfo?.description || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, description: e.target.value })
              }
              required
            />
          </div>

          {/* Course Price */}
          <div className={divStyle}>
            <label htmlFor="price" className={labelStyle}>
              Course Price (₹)
            </label>
            <input
              id="price"
              type="number"
              placeholder="Enter course price"
              className={inputStyle}
              value={courseInfo?.price || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              required
            />
          </div>

          {/* Estimated Price */}
          <div className={divStyle}>
            <label htmlFor="estimatedPrice" className={labelStyle}>
              Estimated Price (₹)
            </label>
            <input
              id="estimatedPrice"
              type="number"
              placeholder="Enter estimated price"
              className={inputStyle}
              value={courseInfo?.estimatedPrice || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
            />
          </div>

          {/* Categories Dropdown */}
          <div className={divStyle}>
            <label htmlFor="categories" className={labelStyle}>
              Course Category
            </label>
            <select
              id="categories"
              className={dropdownStyle}
              value={courseInfo?.categories || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, categories: e.target.value })
              }
              required
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category.title}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className={divStyle}>
            <label htmlFor="tags" className={labelStyle}>
              Course Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              placeholder="e.g. React, JavaScript"
              className={inputStyle}
              value={courseInfo?.tags || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, tags: e.target.value })
              }
            />
          </div>

          {/* Level */}
          <div className={divStyle}>
            <label htmlFor="level" className={labelStyle}>
              Course Level
            </label>
            <select
              id="level"
              className={dropdownStyle}
              value={courseInfo?.level || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Demo Video Upload */}
          <div className="w-full mb-2">
            <input
              type="file"
              accept="video/*"
              id="demoVideo"
              className="hidden"
              onChange={handleDemoChange}
            />
            <label
              htmlFor="demoVideo"
              className={`w-full min-h-[10vh] p-3 border-2 rounded-md transition-colors duration-300 cursor-pointer flex items-center justify-center
                ${dragging ? "border-blue-500 bg-blue-50" : isDark ? "border-gray-600 bg-gray-900" : "border-gray-300 bg-gray-100"}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDemoDrop}
            >
              {demoPreview ? (
                <div className="w-full">
                  <video
                    controls
                    className="w-full h-auto max-h-[200px]"
                    src={demoPreview}
                  />
                  {isEdit &&
                    typeof courseInfo.demoUrl === "string" &&
                    !(courseInfo.demoUrl instanceof File) && (
                      <p className="text-xs mt-1 text-gray-500">
                        Existing demo video
                      </p>
                    )}
                </div>
              ) : (
                <span className={isDark ? "text-white" : "text-black"}>
                  {isEdit
                    ? "Upload new demo video or keep existing"
                    : "Drag and drop or click to upload your demo video"}
                </span>
              )}
            </label>
          </div>

          {/* Thumbnail Upload */}
          <div className="w-full mb-2">
            <input
              type="file"
              accept="image/*"
              id="thumbnail"
              className="hidden"
              onChange={handleThumbnailChange}
            />
            <label
              htmlFor="thumbnail"
              className={`w-full min-h-[10vh] p-3 border-2 rounded-md transition-colors duration-300 cursor-pointer flex items-center justify-center
                ${dragging ? "border-blue-500 bg-blue-50" : isDark ? "border-gray-600 bg-gray-900" : "border-gray-300 bg-gray-100"}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleThumbnailDrop}
            >
              {thumbnailPreview ? (
                <div className="w-full">
                  <Image
                    src={thumbnailPreview}
                    alt="Course Thumbnail Preview"
                    width={600}
                    height={400}
                    className="object-cover w-full h-auto max-h-[200px]"
                  />
                  {isEdit &&
                    typeof courseInfo.thumbnail === "string" &&
                    !(courseInfo.thumbnail instanceof File) && (
                      <p className="text-xs mt-1 text-gray-500">
                        Existing thumbnail
                      </p>
                    )}
                </div>
              ) : (
                <span className={isDark ? "text-white" : "text-black"}>
                  {isEdit
                    ? "Upload new thumbnail or keep existing"
                    : "Drag and drop your thumbnail here or click to browse"}
                </span>
              )}
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded mb-10 hover:bg-blue-700"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseInformation;
