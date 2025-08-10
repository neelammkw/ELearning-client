"use client";

import React, { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useTheme } from "next-themes";

interface CourseOptionsProps {
  active: number;
  setActive: (active: number) => void;
}

const CourseOptions: React.FC<CourseOptionsProps> = ({ active, setActive }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const options = [
    "Course Information",
    "Course Options",
    "Course Content",
    "Course Preview",
  ];

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    inactiveStep: isDark ? "bg-gray-600" : "bg-gray-300",
    connector: isDark ? "bg-gray-500" : "bg-gray-400",
    background: isDark ? "bg-gray-800" : "bg-white",
  };

  return (
    <div
      className={`w-full lg:w-[95%] p-2 lg:p-2 rounded-lg ${themeClasses.background} ${themeClasses.text} shadow-lg`}
    >
      {/* Mobile dropdown button (hidden on desktop) */}
      <div
        className="lg:hidden flex items-center justify-between p-2 rounded-md bg-blue-600 text-white mb-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span>{options[active]}</span>
        {mobileMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      {/* Steps container - hidden on mobile when menu is closed */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} lg:block`}>
        {options.map((option, index) => (
          <div
            key={option}
            className="flex items-start gap-2 cursor-pointer transition-all group mb-0 last:mb-0"
            onClick={() => {
              setActive(index);
              setMobileMenuOpen(false); // Close menu on mobile after selection
            }}
          >
            {/* Step indicator with connector */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${active >= index ? "bg-blue-600" : themeClasses.inactiveStep} 
                transition-colors duration-300`}
              >
                <IoMdCheckmark className="text-white" />
              </div>

              {/* Vertical connector (except last) */}
              {index !== options.length - 1 && (
                <div
                  className={`w-1 h-11
                  ${active > index ? "bg-blue-600" : themeClasses.connector}
                  transition-colors duration-300`}
                />
              )}
            </div>

            {/* Label */}
            <div className="pt-1">
              <span
                className={`text-[16px] font-medium leading-6 ${active === index ? "text-blue-600" : "opacity-80"}`}
              >
                {option}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseOptions;
