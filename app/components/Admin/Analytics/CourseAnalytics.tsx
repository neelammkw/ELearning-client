"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { useTheme } from "next-themes";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const CourseAnalytics = () => {
  const { theme } = useTheme();
  const { data, isLoading } = useGetCoursesAnalyticsQuery({});

  // Format data for monthly analytics chart
  const formatMonthlyData = () => {
    if (!data || !data.courses || !data.courses.last12Months) return [];

    return data.courses.last12Months.map((monthData: any) => ({
      name: monthData.month,
      students: monthData.count || 0,
    }));
  };

  // Pie chart data
  const pieData = [
    { name: "Completed", value: data?.courses?.completed || 0 },
    { name: "In Progress", value: data?.courses?.inProgress || 0 },
    { name: "Not Started", value: data?.courses?.notStarted || 0 },
  ];

  // Chart text color based on theme
  const textColor = theme === "dark" ? "#fff" : "#000";
  const gridColor = theme === "dark" ? "#4B5563" : "#E5E7EB";

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-[#0F172A]" : "bg-[#F8FAFC]"}`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className="pt-5 px-4">
          {data?.courses?.last12Months?.length > 0 ? (
            <div className="max-w-7xl mx-auto">
              <h1
                className={`${styles.title} text-center mb-6 sm:mb-8 ${theme === "dark" ? "text-white" : "text-black"} text-2xl sm:text-3xl`}
              >
                Course Analytics
              </h1>

              {/* Bar Chart Section */}
              <div
                className={`p-4 sm:p-6 rounded-lg shadow-lg mb-6 sm:mb-8 ${theme === "dark" ? "bg-[#1E293B]" : "bg-white"}`}
              >
                <h2
                  className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center ${theme === "dark" ? "text-white" : "text-black"}`}
                >
                  Monthly Course Enrollment
                </h2>
                <div className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formatMonthlyData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="name" tick={{ fill: textColor }} />
                      <YAxis tick={{ fill: textColor }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            theme === "dark" ? "#1E293B" : "#fff",
                          borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
                          color: textColor,
                        }}
                      />
                      <Legend wrapperStyle={{ color: textColor }} />
                      <Bar
                        dataKey="students"
                        fill="#8884d8"
                        name="Enrollments"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart and Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Replace the stats cards section with: */}
                  <div
                    className={`p-6 rounded-lg shadow ${theme === "dark" ? "bg-blue-900" : "bg-blue-100"}`}
                  >
                    <h3
                      className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}
                    >
                      Total Courses
                    </h3>
                    <p
                      className={`text-3xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-black"}`}
                    >
                      {data?.courses?.totalCourses ||
                        data?.courses?.last12Months?.reduce(
                          (sum: number, month: any) => sum + (month.count || 0),
                          0,
                        )}
                    </p>
                  </div>
                  <div
                    className={`p-6 rounded-lg shadow ${theme === "dark" ? "bg-green-900" : "bg-green-100"}`}
                  >
                    <h3
                      className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}
                    >
                      Completed Courses
                    </h3>
                    <p
                      className={`text-3xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-black"}`}
                    >
                      {data?.courses?.completed || 0}
                    </p>
                  </div>

                  <div
                    className={`p-6 rounded-lg shadow ${theme === "dark" ? "bg-yellow-900" : "bg-yellow-100"}`}
                  >
                    <h3
                      className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}
                    >
                      Courses In Progress
                    </h3>
                    <p
                      className={`text-3xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-black"}`}
                    >
                      {data?.courses?.inProgress || 0}
                    </p>
                  </div>
                </div>
                {/* Pie Chart */}
                <div
                  className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-[#1E293B]" : "bg-white"}`}
                >
                  <h2
                    className={`text-xl font-semibold mb-4 text-center ${theme === "dark" ? "text-white" : "text-black"}`}
                  >
                    Course Completion Status
                  </h2>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => (
                            <text
                              fill={textColor}
                              x={0}
                              y={0}
                              textAnchor="middle"
                              dominantBaseline="central"
                            >
                              {`${name}: ${(percent * 100).toFixed(0)}%`}
                            </text>
                          )}
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor:
                              theme === "dark" ? "#1E293B" : "#fff",
                            borderColor:
                              theme === "dark" ? "#334155" : "#E5E7EB",
                            color: textColor,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[50vh] flex items-center justify-center">
              <p
                className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                No course analytics data available
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseAnalytics;
