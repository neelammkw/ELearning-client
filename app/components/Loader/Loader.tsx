"use client";
import React from "react";

interface LoaderProps {
  size?: number; // in pixels
  color?: string; // Tailwind color class or CSS color
  strokeWidth?: number; // border thickness
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 50,
  color = "#3b82f6", // default blue-500
  strokeWidth = 4,
  className = "",
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${className}`}
    >
      <div
        className="animate-spin rounded-full border-t-transparent"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${strokeWidth}px`,
          borderColor: color,
        }}
      />
    </div>
  );
};

export default Loader;
