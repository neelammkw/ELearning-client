"use client";
import React from "react";
import { FiLock, FiUnlock, FiPlay } from "react-icons/fi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import { formatDuration } from "../../utils/formatDuration";

type Props = {
  data: any[];
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  courseId: string;
  isEnrolled: boolean;
};

const CourseContentList = ({
  data,
  activeVideo,
  setActiveVideo,
  user,
  courseId,
  isEnrolled,
}: Props) => {
  const { theme } = useTheme();
  const router = useRouter();

  const handleVideoChange = (index: number, videoId: string) => {
    if (!isEnrolled) {
      toast.error("Please enroll to access this content");
      return;
    }
    setActiveVideo(index);
    window.history.pushState(
      {},
      "",
      `/course-access/${courseId}?video=${videoId}`,
    );
  };

  // Dark mode utility function
  const getThemeClasses = (lightClass: string, darkClass: string) => {
    return theme === "dark" ? darkClass : lightClass;
  };

  return (
    <div className="space-y-6">
      {data?.map((section: any, sectionIndex: number) => (
        <div
          key={sectionIndex}
          className={`
            border rounded-lg overflow-hidden transition-all duration-200 shadow-sm
            ${getThemeClasses("border-gray-200 bg-white", "border-gray-700 bg-gray-800")}
          `}
        >
          <div
            className={`
            p-4 font-medium 
            ${getThemeClasses("bg-gray-50", "bg-gray-800/80")}
          `}
          >
            <div className="flex items-start gap-3">
              <div
                className={`
                flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center
                ${getThemeClasses("bg-blue-50 text-blue-600", "bg-blue-900/30 text-blue-400")}
              `}
              >
                {sectionIndex + 1}
              </div>
              <div className="text-left">
                <h3
                  className={`
                  text-lg font-semibold 
                  ${getThemeClasses("text-gray-800", "text-gray-100")}
                `}
                >
                  {section.videoSection || "Untitled Section"}
                </h3>
                {section.description && (
                  <p
                    className={`
                    text-sm mt-1 
                    ${getThemeClasses("text-gray-600", "text-gray-400")}
                  `}
                  >
                    {section.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div
            className={getThemeClasses("divide-gray-200", "divide-gray-700")}
          >
            {section.videos?.map((video: any, videoIndex: number) => {
              const isActive = activeVideo === videoIndex;

              return (
                <div
                  key={videoIndex}
                  onClick={() => handleVideoChange(videoIndex, video._id)}
                  className={`
                    p-4 flex items-start gap-4 transition-all duration-150 cursor-pointer
                    ${
                      isActive
                        ? getThemeClasses(
                            "bg-blue-50 border-l-4 border-blue-500",
                            "bg-blue-900/20 border-l-4 border-blue-500",
                          )
                        : getThemeClasses(
                            "hover:bg-gray-50",
                            "hover:bg-gray-700/50",
                          )
                    }
                  `}
                >
                  <div
                    className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1
                    ${
                      isActive
                        ? getThemeClasses(
                            "bg-blue-100 text-blue-600",
                            "bg-blue-900/30 text-blue-400",
                          )
                        : getThemeClasses(
                            "bg-gray-100 text-gray-600",
                            "bg-gray-700 text-gray-400",
                          )
                    }
                  `}
                  >
                    <FiPlay className="text-lg" />
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <h4
                      className={`
                      text-base font-medium mb-1
                      ${
                        isActive
                          ? getThemeClasses("text-blue-600", "text-blue-400")
                          : getThemeClasses("text-gray-800", "text-gray-200")
                      }
                    `}
                    >
                      {video.title || "Untitled Video"}
                    </h4>
                    {video.description && (
                      <p
                        className={`
                        text-sm mb-2 line-clamp-2 
                        ${getThemeClasses("text-gray-600", "text-gray-400")}
                      `}
                      >
                        {video.description}
                      </p>
                    )}
                    <div
                      className={`
                      flex items-center gap-3 text-xs 
                      ${getThemeClasses("text-gray-500", "text-gray-400")}
                    `}
                    >
                      <span>
                        Duration: {formatDuration(video.videoLength || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2 ml-2">
                    {isEnrolled ? (
                      <FiUnlock
                        className={`
                        text-lg 
                        ${getThemeClasses("text-blue-500", "text-blue-400")}
                      `}
                      />
                    ) : (
                      <FiLock
                        className={`
                        text-lg 
                        ${getThemeClasses("text-gray-400", "text-gray-500")}
                      `}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseContentList;
