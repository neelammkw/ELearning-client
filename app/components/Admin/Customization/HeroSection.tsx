"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  useGetLayoutQuery,
  useCreateLayoutMutation,
  useEditLayoutMutation,
} from "@/redux/features/layout/layoutApi";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { AiOutlineCamera, AiOutlineSave, AiOutlineEdit } from "react-icons/ai";
import { FiX } from "react-icons/fi";

const HeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("Improve your online learning");
  const [subTitle, setSubTitle] = useState("Experience better instantly");
  const [description, setDescription] = useState(
    "Join thousands of learners worldwide and access high-quality courses from top instructors in various fields of study.",
  );
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // RTK Query hooks
  const { data, refetch } = useGetLayoutQuery("Banner");
  const [createLayout, { isLoading: isCreating }] = useCreateLayoutMutation();
  const [editLayout, { isLoading: isUpdating }] = useEditLayoutMutation();

  // Check if banner exists
  const hasBanner = Boolean(data?.layout?.banner);

  // Initialize form with existing data if available
  useEffect(() => {
    if (data?.layout?.banner) {
      setTitle(data.layout.banner.title || "Improve your online learning");
      setSubTitle(data.layout.banner.subTitle || "Experience better instantly");
      setDescription(
        data.layout.banner.description ||
        "Join thousands of learners worldwide and access high-quality courses from top instructors in various fields of study.",
      );
      setImage(data.layout.banner.image?.url || "");
    }
  }, [data]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.readyState === 2) {
          setImage(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !subTitle || !description || (!image && !hasBanner)) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = {
      type: "Banner",
      banner: {
        image,
        title,
        subTitle,
        description,
      },
    };

    try {
      if (hasBanner) {
        await editLayout(formData).unwrap();
        toast.success("Hero section updated successfully");
      } else {
        await createLayout(formData).unwrap();
        toast.success("Hero section created successfully");
      }
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Error saving hero section");
      console.error("Error saving hero section:", error);
    }
  };

  const isLoading = isCreating || isUpdating || uploading;

  return (
    <div
      className={`w-full p-4 ${isDark ? "bg-gray-900" : "bg-white"} rounded-lg shadow`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-xl font-Poppins font-semibold ${isDark ? "text-white" : "text-black"}`}
        >
          {hasBanner ? "Hero Section" : "Create Hero Section"}
        </h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${isDark
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            <AiOutlineEdit size={18} />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${isDark
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
            >
              <FiX size={18} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${isDark
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
                } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <AiOutlineSave size={18} />
              <span>{isLoading ? "Saving..." : "Save"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Editable Preview Section */}
      <div className={`p-6 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className={`w-full py-12 md:py-24 lg:py-32 ${isDark
          ? "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-purple-50"
          }`}>
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid items-center gap-12 lg:grid-cols-2">

              {/* Left Side - Image */}
              <div className="flex justify-center">
                <div className="relative rounded-full overflow-hidden shadow-2xl w-60 h-60 md:w-76 md:h-76 lg:w-[400px] lg:h-[400px]">
                  {isEditing ? (
                    <label className="absolute inset-0 cursor-pointer flex items-center justify-center">
                      {image ? (
                        <Image
                          src={image}
                          alt="Hero Banner"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex flex-col items-center justify-center">
                          <AiOutlineCamera
                            size={48}
                            className="mx-auto mb-2 text-gray-500"
                          />
                          <span className="text-gray-500">
                            Click to upload hero image
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required={!hasBanner && !image}
                      />
                      {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white">Uploading...</span>
                        </div>
                      )}
                    </label>
                  ) : image ? (
                    <Image
                      src={image}
                      alt="Hero Banner"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">No image selected</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Right Side - Content */}
              <div className="flex flex-col justify-center space-y-6 w-full">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-transparent border-b ${isDark
                        ? "text-white border-gray-600 focus:border-blue-500"
                        : "text-black border-gray-300 focus:border-blue-500"
                        }`}
                      required

                    />

                    <div className="w-full">
                      <input
                        type="text"
                        value={subTitle}
                        onChange={(e) => setSubTitle(e.target.value)}
                        className={`w-full text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-transparent border-b ${isDark
                          ? "text-white border-gray-600 focus:border-blue-500"
                          : "text-gray-800 border-gray-300 focus:border-blue-500"
                          }`}
                        required
                      />
                    </div>
                    <div className="w-full">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`w-full max-w-full md:text-xl bg-transparent border rounded-lg p-2 ${isDark
                          ? "text-gray-300 border-gray-600 focus:border-blue-500"
                          : "text-gray-600 border-gray-300 focus:border-blue-500"
                          }`}
                        rows={4}
                        required
                      />
                    </div>

                  </>
                ) : (
                  <>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                      <span className={`text-transparent bg-clip-text ${isDark
                          ? "bg-gradient-to-r from-purple-400 to-pink-600"
                          : "bg-gradient-to-r from-blue-600 to-purple-600"
                        }`}>
                        {title}
                      </span>
                      <br />
                      <span className={isDark ? "text-white" : "text-gray-800"}>
                        {subTitle}
                      </span>
                    </h1>
                    <p className={`max-w-full md:text-xl ${isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                      {description}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
