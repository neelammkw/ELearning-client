"use client";
import React, { useState, useEffect } from "react";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Faq = () => {
  const { theme } = useTheme();
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (id: number) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`w-[90%] 800px:w-[85%] m-auto py-12 ${theme === "dark" ? "text-white" : "text-black"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2
          className={`text-3xl 800px:text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          Frequently Asked Questions
        </h2>
        <p
          className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
        >
          Find answers to common questions about our courses and platform
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {questions.map((q: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`mb-4 overflow-hidden rounded-lg shadow-md transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <button
              onClick={() => toggleQuestion(index)}
              className={`w-full flex justify-between items-center p-6 text-left ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
              }`}
            >
              <h3 className="text-lg font-medium">{q.question}</h3>
              {activeQuestion === index ? (
                <FaChevronUp className="text-blue-500" />
              ) : (
                <FaChevronDown className="text-blue-500" />
              )}
            </button>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: activeQuestion === index ? "auto" : 0,
                opacity: activeQuestion === index ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className={`overflow-hidden ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <div className="p-6 pt-0">
                <p>{q.answer}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <p
          className={`text-lg mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
        >
          Still have questions? Contact our support team for assistance.
        </p>
        <button
          className={`px-8 py-3 rounded-full font-medium text-lg transition-all ${
            theme === "dark"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          }`}
        >
          Contact Support
        </button>
      </motion.div>
    </div>
  );
};

export default Faq;
