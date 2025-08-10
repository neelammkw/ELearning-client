"use client";
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const UsersAnalytics = () => {
  const { theme } = useTheme();
  const { data: analyticsData, isloading: analyticsLoading } =
    useGetUsersAnalyticsQuery({});
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({});

  // Calculate user statistics from the full user list
  const calculateUserStats = () => {
    if (!usersData)
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        inactiveUsers: 0,
        userTypes: [],
      };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = usersData.filter(
      (user) => user.lastActive && new Date(user.lastActive) >= thirtyDaysAgo,
    ).length;

    const newUsers = usersData.filter(
      (user) => new Date(user.createdAt) >= thirtyDaysAgo,
    ).length;

    const userTypes = usersData.reduce(
      (acc, user) => {
        const role = user.role || "user";
        const existingType = acc.find((type) => type.name === role);
        if (existingType) {
          existingType.count++;
        } else {
          acc.push({ name: role, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[],
    );

    return {
      totalUsers: usersData.length,
      activeUsers,
      newUsers,
      inactiveUsers: usersData.length - activeUsers,
      userTypes,
    };
  };

  const userStats = calculateUserStats();

  // Format data for monthly analytics chart
  const formatMonthlyData = () => {
    if (!analyticsData?.users?.last12Months) return [];
    return analyticsData.users.last12Months.map((monthData: any) => ({
      name: monthData.month,
      count: monthData.count || 0,
    }));
  };

  // Format pie chart data for user status
  const formatPieData = () => {
    return [
      { name: "Active Users", value: userStats.activeUsers },
      { name: "New Users", value: userStats.newUsers },
      { name: "Inactive Users", value: userStats.inactiveUsers },
    ];
  };

  // Format pie chart data for user roles/types
  const formatRoleData = () => {
    return userStats.userTypes;
  };

  const textColor = theme === "dark" ? "#fff" : "#000";
  const gridColor = theme === "dark" ? "#4B5563" : "#E5E7EB";
  const cardBg = theme === "dark" ? "bg-[#1E293B]" : "bg-white";

  if (analyticsLoading || usersLoading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <h1
        className={`${styles.title} text-center mb-8 ${theme === "dark" ? "text-white" : "text-black"}`}
      >
        User Analytics Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className={`${cardBg} border-none shadow`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle
              className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              {userStats.totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardBg} border-none shadow`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle
              className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              Active Users
            </CardTitle>
            <UserCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              {userStats.activeUsers}
            </div>
            <p
              className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mt-1`}
            >
              {userStats.totalUsers
                ? Math.round(
                    (userStats.activeUsers / userStats.totalUsers) * 100,
                  )
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card className={`${cardBg} border-none shadow`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle
              className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              New Users
            </CardTitle>
            <UserPlus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              {userStats.newUsers}
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardBg} border-none shadow`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle
              className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              Inactive Users
            </CardTitle>
            <UserX className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              {userStats.inactiveUsers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly User Data */}
        <Card className={`${cardBg} border-none shadow`}>
          <CardHeader>
            <CardTitle
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            >
              Monthly User Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formatMonthlyData()}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: textColor }}
                  tickFormatter={(value) => value.split(" ")[0]} // Show just month abbreviation
                />
                <YAxis tick={{ fill: textColor }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1E293B" : "#fff",
                    borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
                    color: textColor,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Status */}
        <Card className={`${cardBg} border-none shadow`}>
          <CardHeader>
            <CardTitle
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            >
              User Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatPieData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {formatPieData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1E293B" : "#fff",
                    borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
                    color: textColor,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional User Role Distribution */}
      <div className="grid grid-cols-1 mb-8">
        <Card className={`${cardBg} border-none shadow`}>
          <CardHeader>
            <CardTitle
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            >
              User Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatRoleData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {formatRoleData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1E293B" : "#fff",
                    borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
                    color: textColor,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersAnalytics;
