"use client";
import React, { FC, useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsPencil } from "react-icons/bs";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

interface Props {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEdit?: boolean;
}

const CourseContent: FC<Props> = ({
  courseContentData,
  setCourseContentData,
  active,
  setActive,
  isEdit,
  handleSubmit: handleCourseSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean[]>([]);
  const [activeSection, setActiveSection] = useState(1);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Initialize component
  useEffect(() => {
    if (courseContentData.length > 0) {
      setIsCollapsed(Array(courseContentData.length).fill(false));

      // Initialize video previews and normalize videoUrl structure
      const updatedData = courseContentData.map((item: any, index: number) => {
        let videoUrl = item.videoUrl;
        let videoPreview = item.videoPreview;

        // Handle different videoUrl formats
        if (typeof videoUrl === "string") {
          videoUrl = { url: videoUrl, public_id: "" };
        } else if (videoUrl && !videoUrl.url) {
          videoUrl = { url: "", public_id: "" };
        }

        if (!videoPreview && videoUrl?.url) {
          videoPreview = videoUrl.url;
        }

        return {
          ...item,
          videoUrl,
          videoPreview,
          // Temporary storage for new uploads
          videoFile: null,
        };
      });

      setCourseContentData(updatedData);
    }
  }, []);

  const handleCollapseToggle = (index: number) => {
    const updated = [...isCollapsed];
    updated[index] = !updated[index];
    setIsCollapsed(updated);
  };

  const handleRemoveLink = (itemIndex: number, linkIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[itemIndex].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  };

  // Update the handleVideoUpload function
  const handleVideoUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const updatedData = [...courseContentData];

      // Preserve existing videoUrl if it exists
      const existingVideoUrl = updatedData[index].videoUrl || {
        url: "",
        public_id: "",
      };

      updatedData[index] = {
        ...updatedData[index],
        videoFile: file,
        videoPreview: result,
        // Maintain the existing videoUrl structure
        videoUrl: {
          ...existingVideoUrl,
          // Only update url if we want to preview the new file
          // Otherwise keep the existing URL
          url: result,
        },
      };

      setCourseContentData(updatedData);
    };
    reader.onerror = (error) => {
      console.error("Error reading video file:", error);
      toast.error("Failed to process video file");
    };
    reader.readAsDataURL(file);
  };

  const newContentHandler = () => {
    const lastItem = courseContentData[courseContentData.length - 1];

    const requiredFields = [
      lastItem.title,
      lastItem.description,
      lastItem.videoPreview || (lastItem.videoUrl && lastItem.videoUrl.url),
      lastItem.links[0]?.title,
      lastItem.links[0]?.url,
      lastItem.videoLength,
    ];

    if (requiredFields.some((field) => !field)) {
      console.error("Validation failed - missing fields");
      toast.error("Please fill all the fields first");
      return;
    }

    const newVideoSection = lastItem.videoSection || "";
    const newContent = {
      videoUrl: { url: "", public_id: "" }, // Proper object structure
      videoPreview: "",
      videoFile: null,
      title: "",
      description: "",
      videoSection: newVideoSection,
      videoLength: 0,
      links: [{ title: "", url: "" }],
    };

    setCourseContentData([...courseContentData, newContent]);
    setIsCollapsed([...isCollapsed, false]);
  };

  const addNewSection = () => {
    const lastItem = courseContentData[courseContentData.length - 1];

    const requiredFields = [
      lastItem.title,
      lastItem.description,
      lastItem.videoPreview || (lastItem.videoUrl && lastItem.videoUrl.url),
      lastItem.links[0]?.title,
      lastItem.links[0]?.url,
      lastItem.videoLength,
    ];

    if (requiredFields.some((field) => !field)) {
      console.error("Validation failed - missing fields");
      toast.error("Please fill all the fields first!");
      return;
    }

    const newContent = {
      videoUrl: { url: "", public_id: "" }, // Proper object structure
      videoPreview: "",
      videoFile: null,
      title: "",
      description: "",
      videoSection: `Untitled Section ${activeSection}`,
      videoLength: 0,
      links: [{ title: "", url: "" }],
    };

    setActiveSection(activeSection + 1);
    setCourseContentData([...courseContentData, newContent]);
    setIsCollapsed([...isCollapsed, false]);
  };

  const handleNext = () => {
    const isValid = courseContentData.every((item, index) => {
      const hasVideo =
        item.videoPreview || (item.videoUrl && item.videoUrl.url);
      const linksValid = item.links.every(
        (link: any) => link.title && link.url,
      );

      const isValid =
        item.title &&
        item.description &&
        hasVideo &&
        item.videoLength &&
        linksValid;

      if (!isValid) {
        console.error(`Validation failed for section ${index}:`, {
          title: item.title,
          description: item.description,
          hasVideo,
          videoLength: item.videoLength,
          linksValid,
        });
      }

      return isValid;
    });

    if (!isValid) {
      console.error("Validation failed - not all sections are complete");
      toast.error("Please fill all fields in all sections");
      return;
    }

    setActive(active + 1);
  };

  const removeVideo = (index: number) => {
    const updatedData = [...courseContentData];
    updatedData[index] = {
      ...updatedData[index],
      videoPreview: "",
      videoFile: null,
      videoUrl: { url: "", public_id: "" },
    };
    setCourseContentData(updatedData);
  };

  return (
    <div className="w-[90%] m-auto mt-10 mb-10">
      
      <form onSubmit={handleCourseSubmit}>
        {courseContentData.map((item: any, index: number) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1]?.videoSection;

          return (
            <div
              key={index}
              className={`backdrop-blur-sm bg-opacity-50 ${
                isDark ? "bg-slate-800" : "bg-slate-100"
              } rounded-lg shadow-lg p-4 mb-6`}
            > <h3>
          Course Content
        </h3>
              {showSectionInput && (
                <div className="flex items-center mb-3">
                  <input
                    type="text"
                    className={`text-[20px] font-Poppins bg-transparent outline-none ${
                      item.videoSection === "Untitled Section"
                        ? "w-[170px]"
                        : "w-min"
                    } ${isDark ? "text-white placeholder-gray-400" : "text-black"}`}
                    placeholder="Untitled Video"
                    value={item.videoSection}
                    onChange={(e) => {
                      const updatedData = [...courseContentData];
                      updatedData[index].videoSection = e.target.value;
                      setCourseContentData(updatedData);
                    }}
                  />
                  <BsPencil
                    className={`ml-2 cursor-pointer ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  />
                </div>
              )}

              <div className="flex justify-between items-center">
                {isCollapsed[index] && item.title && (
                  <p
                    className={`font-Poppins ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    {index + 1}. {item.title} ({item.videoLength} min)
                  </p>
                )}
                <div className="flex items-center">
                  <AiOutlineDelete
                    className={`text-[20px] mr-2 ${
                      index > 0 ? "cursor-pointer" : "cursor-not-allowed"
                    } ${isDark ? "text-white" : "text-black"}`}
                    onClick={() => {
                      if (index > 0) {
                        const updatedData = [...courseContentData];
                        updatedData.splice(index, 1);
                        setCourseContentData(updatedData);

                        const updatedCollapse = [...isCollapsed];
                        updatedCollapse.splice(index, 1);
                        setIsCollapsed(updatedCollapse);
                      }
                    }}
                  />
                  <MdOutlineKeyboardArrowDown
                    className={`cursor-pointer transition-transform duration-300 ${
                      isDark ? "text-white" : "text-black"
                    }`}
                    style={{
                      transform: isCollapsed[index]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                    onClick={() => handleCollapseToggle(index)}
                  />
                </div>
              </div>

              {!isCollapsed[index] && (
                <>
                  <div className="my-3">
                    <label
                      className={`${styles.label} ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].title = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                      className={`${styles.input} mt-1 ${
                        isDark
                          ? "text-white placeholder-gray-400"
                          : "text-black"
                      }`}
                      placeholder="Enter video title..."
                      required
                    />
                  </div>

                  <div className="my-3">
                    <label
                      className={`${styles.label} ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {item.videoPreview || item.videoUrl?.url
                        ? "Change Video"
                        : "Upload Video"}
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleVideoUpload(index, file);
                        }
                      }}
                      className={`${styles.input} mt-1 ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    />
                    {(item.videoPreview || item.videoUrl?.url) && (
                      <div className="mt-2">
                        <video
                          controls
                          src={item.videoPreview || item.videoUrl.url}
                          className="w-full max-h-[200px]"
                        />
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="text-red-500 text-sm mt-1"
                        >
                          Remove Video
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="my-3">
                    <label
                      className={`${styles.label} ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Video Length (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.videoLength || ""}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].videoLength =
                          parseInt(e.target.value) || 0;
                        setCourseContentData(updatedData);
                      }}
                      className={`${styles.input} mt-1 ${
                        isDark
                          ? "text-white placeholder-gray-400"
                          : "text-black"
                      }`}
                      placeholder="Enter video length in minutes"
                      required
                    />
                  </div>

                  <div className="my-3">
                    <label
                      className={`${styles.label} ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].description = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                      className={`${styles.input} mt-1 ${
                        isDark
                          ? "text-white placeholder-gray-400"
                          : "text-black"
                      }`}
                      placeholder="Enter description..."
                      rows={4}
                      required
                    />
                  </div>

                  {item.links.map((link: any, linkIndex: number) => (
                    <div className="mb-3" key={linkIndex}>
                      <div className="flex justify-between items-center">
                        <label
                          className={`${styles.label} ${
                            isDark ? "text-white" : "text-black"
                          }`}
                        >
                          Link {linkIndex + 1}
                        </label>
                        <AiOutlineDelete
                          className={`${
                            linkIndex === 0
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          } text-[20px] ${isDark ? "text-white" : "text-black"}`}
                          onClick={() =>
                            linkIndex === 0
                              ? null
                              : handleRemoveLink(index, linkIndex)
                          }
                        />
                      </div>
                      <input
                        type="text"
                        value={link.title}
                        placeholder="Link title"
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].links[linkIndex].title =
                            e.target.value;
                          setCourseContentData(updatedData);
                        }}
                        className={`${styles.input} mt-1 ${
                          isDark
                            ? "text-white placeholder-gray-400"
                            : "text-black"
                        }`}
                        required
                      />
                      <input
                        type="text"
                        value={link.url}
                        placeholder="Link URL"
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].links[linkIndex].url =
                            e.target.value;
                          setCourseContentData(updatedData);
                        }}
                        className={`${styles.input} mt-1 ${
                          isDark
                            ? "text-white placeholder-gray-400"
                            : "text-black"
                        }`}
                        required
                      />
                      {link.url && (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm mt-1 block"
                        >
                          Preview Link
                        </a>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedData = [...courseContentData];
                      updatedData[index].links.push({ title: "", url: "" });
                      setCourseContentData(updatedData);
                    }}
                    className={`text-sm font-medium mt-2 mb-4 flex items-center ${
                      isDark
                        ? "text-blue-400 hover:text-blue-600"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    <AiOutlinePlusCircle className="mr-1" /> Add New Link
                  </button>
                </>
              )}

              {index === courseContentData.length - 1 && (
                <div className="mt-6">
                  <p
                    className={`flex items-center text-[18px] cursor-pointer ${
                      isDark ? "text-white" : "text-black"
                    }`}
                    onClick={newContentHandler}
                  >
                    <AiOutlinePlusCircle className="mr-2" />
                    Add New Content
                  </p>
                </div>
              )}
            </div>
          );
        })}

        <div
          className={`flex items-center text-[20px] cursor-pointer ${
            isDark ? "text-white" : "text-black"
          }`}
          onClick={addNewSection}
        >
          <AiOutlinePlusCircle className="mr-2" /> Add New Section
        </div>
      </form>

      <div className="flex justify-between items-center mt-10">
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          onClick={() => setActive(active - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseContent;
