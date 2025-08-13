"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  useGetLayoutQuery,
  useCreateLayoutMutation,
  useEditLayoutMutation,
} from "@/redux/features/layout/layoutApi";
import { toast } from "react-hot-toast";
import { FiPlus, FiTrash2, FiEdit, FiSave, FiX } from "react-icons/fi";

const CategoriesSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [categories, setCategories] = useState<{ title: string }[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const { data, refetch } = useGetLayoutQuery("Categories");
  const [createLayout, { isLoading: isCreating }] = useCreateLayoutMutation();
  const [editLayout, { isLoading: isUpdating }] = useEditLayoutMutation();

  const hasCategories = Boolean(data?.layout?.categories?.length);

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  const startAddingNew = () => {
    setIsAddingNew(true);
    setEditingIndex(null);
    setNewTitle("");
  };

  const cancelEditing = () => {
    setIsAddingNew(false);
    setEditingIndex(null);
  };

  const handleSaveCategory = () => {
    if (!newTitle.trim()) {
      toast.error("Please enter a category title");
      return;
    }

    if (editingIndex !== null) {
      // Update existing category
      const updatedCategories = [...categories];
      updatedCategories[editingIndex] = { title: newTitle };
      setCategories(updatedCategories);
    } else {
      // Add new category
      setCategories([...categories, { title: newTitle }]);
    }

    setNewTitle("");
    setEditingIndex(null);
    setIsAddingNew(false);
  };

  const handleEditCategory = (index: number) => {
    setEditingIndex(index);
    setIsAddingNew(false);
    setNewTitle(categories[index].title);
  };

  const handleDeleteCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    if (editingIndex === index) cancelEditing();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categories.length) {
      toast.error("Please add at least one category");
      return;
    }

    try {
      if (hasCategories) {
        await editLayout({
          type: "Categories",
          categories,
        }).unwrap();
        toast.success("Categories updated successfully");
      } else {
        await createLayout({
          type: "Categories",
          categories,
        }).unwrap();
        toast.success("Categories created successfully");
      }
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Error saving categories");
      console.error("Error saving categories:", error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div
      className={`w-full p-4 ${isDark ? "bg-gray-900" : "bg-white"} rounded-lg shadow`}
    >
      
      {/* Categories List with Editing */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Course Categories</h2>
          <button
            type="button"
            onClick={startAddingNew}
            disabled={isAddingNew || editingIndex !== null}
            className={`px-3 py-2 rounded-md flex items-center space-x-2 ${
              isDark
                ? "bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-700"
                : "bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-200"
            }`}
          >
            <FiPlus size={18} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Add New Category Form */}
        {isAddingNew && (
          <div
            className={`p-4 rounded-lg mb-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Add New Category</h3>
                <button
                  onClick={cancelEditing}
                  className={`p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                >
                  <FiX size={18} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="Enter category title"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className={`px-3 py-1 rounded-md ${
                    isDark
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCategory}
                  className={`px-3 py-1 rounded-md ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
              >
                {editingIndex === index ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Edit Category</h3>
                      <button
                        onClick={cancelEditing}
                        className={`p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                      >
                        <FiX size={18} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEditing}
                        className={`px-3 py-1 rounded-md ${
                          isDark
                            ? "bg-gray-600 hover:bg-gray-700 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCategory}
                        className={`px-3 py-1 rounded-md ${
                          isDark
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{category.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(index)}
                        className={`p-1.5 rounded-md ${
                          isDark
                            ? "hover:bg-gray-700 text-blue-400"
                            : "hover:bg-gray-200 text-blue-600"
                        }`}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(index)}
                        className={`p-1.5 rounded-md ${
                          isDark
                            ? "hover:bg-gray-700 text-red-400"
                            : "hover:bg-gray-200 text-red-600"
                        }`}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              className={`p-8 text-center rounded-lg ${
                isDark
                  ? "bg-gray-800 text-gray-400"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              {isAddingNew
                ? "Complete the form above to add your first category"
                : "No categories added yet"}
            </div>
          )}
        </div>
      </div>

      {/* Save All Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || categories.length === 0}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            isDark
              ? "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700"
              : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
          }`}
        >
          {isLoading ? "Saving..." : "Save All Categories"}
        </button>
      </div>
    </div>
  );
};

export default CategoriesSection;
