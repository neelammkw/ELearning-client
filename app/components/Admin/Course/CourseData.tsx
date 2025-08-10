import { styles } from "@/app/styles/style";
import React, { FC, useState, useEffect } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useTheme } from "next-themes";

interface Props {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
  isEdit?: boolean;
}

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
  isEdit,
}) => {
  const [errors, setErrors] = useState({
    benefits: [] as boolean[],
    prerequisites: [] as boolean[],
  });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Initialize errors on mount and when benefits/prerequisites change
  useEffect(() => {
    setErrors({
      benefits: benefits.map((b) => b.title.trim() === ""),
      prerequisites: prerequisites.map((p) => p.title.trim() === ""),
    });
  }, [benefits, prerequisites]);

  // ---------- Benefits ----------
  const handleBenefitChange = (index: number, value: string) => {
    const updated = [...benefits];
    updated[index].title = value;
    setBenefits(updated);

    // Update errors for this field
    const newErrors = [...errors.benefits];
    newErrors[index] = value.trim() === "";
    setErrors((prev) => ({ ...prev, benefits: newErrors }));
  };

  const handleAddBenefit = () => {
    const newBenefits = [...benefits, { title: "" }];
    setBenefits(newBenefits);
    setErrors((prev) => ({
      ...prev,
      benefits: [...prev.benefits, false],
    }));
  };

  const handleRemoveBenefit = (index: number) => {
    if (benefits.length <= 1 && !isEdit) return;
    const updated = benefits.filter((_, i) => i !== index);
    setBenefits(updated);
  };

  // ---------- Prerequisites ----------
  const handlePrerequisiteChange = (index: number, value: string) => {
    const updated = [...prerequisites];
    updated[index].title = value;
    setPrerequisites(updated);

    // Update errors for this field
    const newErrors = [...errors.prerequisites];
    newErrors[index] = value.trim() === "";
    setErrors((prev) => ({ ...prev, prerequisites: newErrors }));
  };

  const handleAddPrerequisite = () => {
    const newPrerequisites = [...prerequisites, { title: "" }];
    setPrerequisites(newPrerequisites);
    setErrors((prev) => ({
      ...prev,
      prerequisites: [...prev.prerequisites, false],
    }));
  };

  const handleRemovePrerequisite = (index: number) => {
    if (prerequisites.length <= 1 && !isEdit) return;
    const updated = prerequisites.filter((_, i) => i !== index);
    setPrerequisites(updated);
  };

  // ---------- Validation ----------
  const validateForm = () => {
    const hasEmptyBenefits = benefits.some((b) => b.title.trim() === "");
    const hasEmptyPrerequisites = prerequisites.some(
      (p) => p.title.trim() === "",
    );

    if (hasEmptyBenefits || hasEmptyPrerequisites) {
      setErrors({
        benefits: benefits.map((b) => b.title.trim() === ""),
        prerequisites: prerequisites.map((p) => p.title.trim() === ""),
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      setActive(active + 1);
    } else {
      toast.error("Please fill all fields before proceeding");
    }
  };

  return (
    <div className="w-[90%] m-auto mt-10">
      <div
        className={`backdrop-blur-sm bg-opacity-50 ${
          isDark ? "bg-slate-800 text-white" : "bg-slate-100 text-black"
        } rounded-lg shadow-lg p-4 mb-6`}
      >
        {/* Benefits Section */}
        <div className="mb-8">
          <label className={`${styles.label} text-[20px] block mb-4`}>
            What are the benefits for students in this course?
          </label>

          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 mb-3">
              <input
                type="text"
                name="Benefit"
                placeholder="You will be able to build a full stack LMS Platform..."
                className={`${styles.input} flex-1 ${
                  isDark ? "bg-[#1e1e1e] text-white placeholder-gray-400" : ""
                } ${errors.benefits[index] ? "border-red-500" : ""}`}
                value={benefit.title}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
              />
              {(benefits.length > 1 || isEdit) && (
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(index)}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  <RemoveCircleIcon
                    className={`${isDark ? "text-red-400" : "text-red-500"}`}
                  />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddBenefit}
            className={`flex items-center gap-1 mt-2 ${
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            }`}
          >
            <AddCircleIcon />
            <span>Add Benefit</span>
          </button>
        </div>

        {/* Prerequisites Section */}
        <div className="mb-8">
          <label className={`${styles.label} text-[20px] block mb-4`}>
            What are the prerequisites for this course?
          </label>

          {prerequisites.map((prereq, index) => (
            <div key={index} className="flex items-center gap-3 mb-3">
              <input
                type="text"
                name="Prerequisite"
                placeholder="Basic knowledge of HTML, CSS, JavaScript..."
                className={`${styles.input} flex-1 ${
                  isDark ? "bg-[#1e1e1e] text-white placeholder-gray-400" : ""
                } ${errors.prerequisites[index] ? "border-red-500" : ""}`}
                value={prereq.title}
                onChange={(e) =>
                  handlePrerequisiteChange(index, e.target.value)
                }
              />
              {(prerequisites.length > 1 || isEdit) && (
                <button
                  type="button"
                  onClick={() => handleRemovePrerequisite(index)}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  <RemoveCircleIcon
                    className={`${isDark ? "text-red-400" : "text-red-500"}`}
                  />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddPrerequisite}
            className={`flex items-center gap-1 mt-2 ${
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            }`}
          >
            <AddCircleIcon />
            <span>Add Prerequisite</span>
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-300 dark:border-gray-600">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              isDark
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
            onClick={() => setActive(active - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              isDark
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseData;
