"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  useGetLayoutQuery,
  useCreateLayoutMutation,
  useEditLayoutMutation,
} from "@/redux/features/layout/layoutApi";
import { toast } from "react-hot-toast";
import { FiPlus, FiTrash2, FiEdit, FiX } from "react-icons/fi";

const FaqSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const { data, refetch } = useGetLayoutQuery("FAQ");
  const [createLayout, { isLoading: isCreating }] = useCreateLayoutMutation();
  const [editLayout, { isLoading: isUpdating }] = useEditLayoutMutation();

  const hasFaq = Boolean(data?.layout?.faq?.length);

  useEffect(() => {
    if (data?.layout?.faq) {
      setFaqs(data.layout.faq);
    }
  }, [data]);

  const startAddingNew = () => {
    setIsAddingNew(true);
    setEditingIndex(null);
    setNewQuestion("");
    setNewAnswer("");
  };

  const cancelEditing = () => {
    setIsAddingNew(false);
    setEditingIndex(null);
  };

  const handleSaveFaq = () => {
    if (!newQuestion || !newAnswer) {
      toast.error("Please fill both question and answer");
      return;
    }

    if (editingIndex !== null) {
      const updatedFaqs = [...faqs];
      updatedFaqs[editingIndex] = { question: newQuestion, answer: newAnswer };
      setFaqs(updatedFaqs);
    } else {
      setFaqs([...faqs, { question: newQuestion, answer: newAnswer }]);
    }

    setNewQuestion("");
    setNewAnswer("");
    setEditingIndex(null);
    setIsAddingNew(false);
  };

  const handleEditFaq = (index: number) => {
    setEditingIndex(index);
    setIsAddingNew(false);
    setNewQuestion(faqs[index].question);
    setNewAnswer(faqs[index].answer);
  };

  const handleDeleteFaq = (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
    if (editingIndex === index) cancelEditing();
  };

  // For creating/updating FAQs
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!faqs.length) {
      toast.error("Please add at least one FAQ");
      return;
    }

    try {
      if (hasFaq) {
        await editLayout({
          type: "FAQ",
          faq: faqs,
        }).unwrap();
        toast.success("FAQ section updated successfully");
      } else {
        await createLayout({
          type: "FAQ",
          faq: faqs,
        }).unwrap();
        toast.success("FAQ section created successfully");
      }
      refetch();
    } catch (error) {
      toast.error("Error saving FAQ section");
      console.error("Error saving FAQ section:", error);
    }
  };
  const isLoading = isCreating || isUpdating;

  return (
    <div
      className={`w-full p-4 ${isDark ? "bg-gray-900" : "bg-white"} rounded-lg shadow`}
    >
      <h1
        className={`text-xl font-Poppins font-semibold ${isDark ? "text-white" : "text-black"} mb-6`}
      >
        {hasFaq ? "Edit FAQ Section" : "Create FAQ Section"}
      </h1>

      {/* Integrated Preview and Editing Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">FAQs</h2>
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
            <span>Add FAQ</span>
          </button>
        </div>

        {/* Add New FAQ Form (shown at top when active) */}
        {isAddingNew && (
          <div
            className={`p-4 rounded-lg mb-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Add New FAQ</h3>
                <button
                  onClick={cancelEditing}
                  className={`p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                >
                  <FiX size={18} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="Enter question"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Answer</label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={3}
                  className={`w-full p-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="Enter answer"
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
                  onClick={handleSaveFaq}
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

        {/* FAQ List with Edit/Delete Options */}
        <div className="space-y-3">
          {faqs.length > 0 ? (
            faqs.map((faq, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
              >
                {editingIndex === index ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Edit FAQ</h3>
                      <button
                        onClick={cancelEditing}
                        className={`p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                      >
                        <FiX size={18} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      rows={3}
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
                        onClick={handleSaveFaq}
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
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{faq.question}</h3>
                      <p
                        className={`mt-1 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {faq.answer}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditFaq(index)}
                        className={`p-1.5 rounded-md ${
                          isDark
                            ? "hover:bg-gray-700 text-blue-400"
                            : "hover:bg-gray-200 text-blue-600"
                        }`}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(index)}
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
                ? "Complete the form above to add your first FAQ"
                : "No FAQs added yet"}
            </div>
          )}
        </div>
      </div>

      {/* Save All Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || faqs.length === 0}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            isDark
              ? "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700"
              : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
          }`}
        >
          {isLoading ? "Saving..." : "Save All FAQs"}
        </button>
      </div>
    </div>
  );
};

export default FaqSection;
