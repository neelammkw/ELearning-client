"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { useTheme } from "next-themes";

const OrdersAnalytics = () => {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  const { data, isLoading } = useGetOrdersAnalyticsQuery({});

  // Format data for monthly order analytics chart
  const formatMonthlyData = () => {
    if (!data || !data.orders || !data.orders.last12Months) return [];

    return data.orders.last12Months.map((monthData) => ({
      name: monthData.month,
      orders: monthData.count || 0,
    }));
  };

  return (
    <div className="h-screen ">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[20px]">
          {data?.orders?.last12Months?.length > 0 ? (
            <div className="w-full h-[80vh]">
              {/* Line Chart for Order Trends */}
              <div className="w-full h-[80%]">
                <h1
                  className={`${styles.title} text-center mb-8 ${theme === "dark" ? "text-white" : "text-black"}`}
                >
                  Order Trends (Last 12 Months)
                </h1>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formatMonthlyData()}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Orders"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="w-full h-[50vh] flex items-center justify-center">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No order analytics data available
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersAnalytics;
