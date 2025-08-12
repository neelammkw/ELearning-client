"use client";
import React, { FC } from "react";

type Props = {
  videoUrl: string | null | undefined;
  title: string;
  onLoadStart?: () => void;
  onLoaded?: () => void;
};

const CoursePlayer: FC<Props> = ({
  videoUrl,
  title,
  onLoadStart = () => {},
  onLoaded = () => {},
}) => {
  // Safely check if videoUrl exists and is a string
  const isValidVideo =
    typeof videoUrl === "string" && videoUrl.trim().length > 0;
  const isYouTube =
    isValidVideo &&
    (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="flex flex-col items-center">
      {isValidVideo ? (
        isYouTube ? (
          <iframe
            className="w-full rounded"
            src={getYouTubeEmbedUrl(videoUrl)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoadStart={onLoadStart}
            onLoad={onLoaded}
          />
        ) : (
          <video
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            className="w-full rounded"
            onLoadStart={onLoadStart}
            onLoadedData={onLoaded}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      ) : (
        <div className="w-full  bg-gray-200 flex items-center justify-center rounded dark:bg-gray-700">
          <div className="text-center p-6">
            <p className="text-lg font-medium dark:text-white">
              Video content not available
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {title || "No video title provided"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
