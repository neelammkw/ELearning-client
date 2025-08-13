"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ShoppingCart as OrderIcon,
  Book as CourseIcon,
  TrendingUp as GrowthIcon,
  DollarSign as RevenueIcon,
} from "react-feather";
import PeopleIcon from "@mui/icons-material/People";
import {
  useGetUsersAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
  useGetCoursesAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import Loader from "../Loader/Loader";
import DashboardHero from "./DashboardHero";

const AdminDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:960px)");

  // Analytics queries
  const { data: usersResponse, isLoading: usersLoading } =
    useGetUsersAnalyticsQuery({});
  const { data: ordersResponse, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery({});
  const { data: coursesResponse, isLoading: coursesLoading } =
    useGetCoursesAnalyticsQuery({});
  const { data: allUsers, isLoading: allUsersLoading } = useGetAllUsersQuery(
    {},
  );
  const { data: allOrders, isLoading: allOrdersLoading } = useGetAllOrdersQuery(
    {},
  );

  // Extract data from responses
  const usersData = usersResponse?.users;
  const ordersData = ordersResponse?.orders;
  const coursesData = coursesResponse?.courses;

  const allOrdersData = allOrders?.orders || [];
  const allUsersData = allUsers || [];

  // Format data for charts
  const formatUserData = () => {
    if (!usersData?.last12Months) return [];
    return usersData.last12Months.map((month: any) => ({
      name: month.month.split(" ")[0],
      users: month.count || 0,
    }));
  };

  const formatOrderData = () => {
    if (!ordersData?.last12Months) return [];

    return ordersData.last12Months.map((month: any) => {
      const monthName = month.month.split(" ")[0];
      const monthYear = month.month.split(" ")[1];

      // Calculate revenue for this month from all orders
      const monthlyRevenue = allOrdersData
        .filter((order: any) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.toLocaleString("default", { month: "short" }) ===
            monthName && orderDate.getFullYear().toString() === monthYear
          );
        })
        .reduce((sum: number, order: any) => {
          return sum + (order.payment_info?.amount || order.totalAmount || 0);
        }, 0);

      return {
        name: monthName,
        orders: month.count || 0,
        revenue: monthlyRevenue,
      };
    });
  };

  const formatCourseData = () => {
    if (!coursesData?.last12Months) return [];

    return coursesData.last12Months.map((month: any) => {
      const monthName = month.month.split(" ")[0];
      const monthYear = month.month.split(" ")[1];

      // Calculate enrollments for this month from all users
      const monthlyEnrollments = allUsersData
        .filter((user: any) => {
          const userDate = new Date(user.createdAt);
          return (
            userDate.toLocaleString("default", { month: "short" }) ===
            monthName && userDate.getFullYear().toString() === monthYear
          );
        })
        .reduce((sum: number, user: any) => {
          return sum + (user.courses?.length || 0);
        }, 0);

      return {
        name: monthName,
        courses: month.count || 0,
        enrollments: monthlyEnrollments,
      };
    });
  };

  // Calculate stats with proper fallbacks
  const calculateStats = () => {
    const courseMonths = coursesData?.last12Months || [];
    const orderMonths = ordersData?.last12Months || [];
    const userMonths = usersData?.last12Months || [];

    const totalEnrollments = allUsersData.reduce((sum: number, user: any) => {
      return sum + (user.courses?.length || 0);
    }, 0);

    const totalRevenue = allOrdersData.reduce((sum: number, order: any) => {
      return sum + (order.payment_info?.amount || order.totalAmount || 0);
    }, 0);

    // Calculate last month's revenue
    const lastMonthRevenue = allOrdersData
      .filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        return (
          orderDate.getMonth() === now.getMonth() - 1 &&
          orderDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum: number, order: any) => {
        return sum + (order.payment_info?.amount || order.totalAmount || 0);
      }, 0);

    return {
      totalUsers: userMonths.reduce(
        (sum: number, month: any) => sum + (month.count || 0),
        0,
      ),
      lastMonthUsers: userMonths[11]?.count || 0,
      userGrowth:
        userMonths.length >= 2
          ? ((userMonths[11]?.count - (userMonths[10]?.count || 0)) /
            (userMonths[10]?.count || 1)) *
          100
          : 0,
      totalOrders: orderMonths.reduce(
        (sum: number, month: any) => sum + (month.count || 0),
        0,
      ),
      lastMonthOrders: orderMonths[11]?.count || 0,
      totalRevenue,
      lastMonthRevenue,
      totalCourses:
        coursesData?.totalCourses ||
        courseMonths.reduce(
          (sum: number, month: any) => sum + (month.count || 0),
          0,
        ),
      lastMonthCourses: courseMonths[11]?.count || 0,
      totalEnrollments,
      recentUsers: Array.isArray(allUsersData) ? allUsersData.slice(0, 5) : [],
      recentOrders: allOrdersData.slice(0, 5),
    };
  };

  const stats = calculateStats();

  if (
    usersLoading ||
    ordersLoading ||
    coursesLoading ||
    allUsersLoading ||
    allOrdersLoading
  ) {
    return <Loader />;
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: isDark ? "#2a2a40" : "#fff",
            border: `1px solid ${isDark ? "#555" : "#ddd"}`,
            padding: "10px",
            borderRadius: "5px",
            color: isDark ? "#fff" : "#333",
          }}
        >
          <p>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name === "revenue"
                ? "$" + entry.value.toLocaleString()
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 3,
        maxWidth: "100%",
        overflowX: "hidden",
        backgroundColor: isDark ? "#121212" : "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <DashboardHero title="Admin Dashboard" />

      {/* Summary Cards - Responsive Grid */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
        {[
          {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: <PeopleIcon color={isDark ? "#90caf9" : "#1976d2"} />,
            bgColor: isDark ? "#1e3a8a" : "#dbeafe",
            textColor: isDark ? "#e0f2fe" : "#1e3b8a",
            secondary: `${Math.abs(stats.userGrowth).toFixed(1)}% ${stats.userGrowth >= 0 ? "↑" : "↓"}`,
            secondaryColor: stats.userGrowth >= 0 ? "#4ade80" : "#f87171",
          },
          {
            title: "Total Courses",
            value: stats.totalCourses.toLocaleString(),
            icon: <CourseIcon color={isDark ? "#86efac" : "#15803d"} />,
            bgColor: isDark ? "#14532d" : "#dcfce7",
            textColor: isDark ? "#bbf7d0" : "#166534",
            secondary: `${stats.totalEnrollments.toLocaleString()} enrollments`,
            secondaryColor: isDark ? "#a5f3fc" : "#0e7490",
          },
          {
            title: "Total Orders",
            value: stats.totalOrders.toLocaleString(),
            icon: <OrderIcon color={isDark ? "#fca5a5" : "#b91c1c"} />,
            bgColor: isDark ? "#7f1d1d" : "#fee2e2",
            textColor: isDark ? "#fecaca" : "#991b1b",
            secondary: `+${stats.lastMonthOrders} this month`,
            secondaryColor: isDark ? "#fcd34d" : "#92400e",
          },
          {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: <RevenueIcon color={isDark ? "#a78bfa" : "#7c3aed"} />,
            bgColor: isDark ? "#4c1d95" : "#ede9fe",
            textColor: isDark ? "#c4b5fd" : "#5b21b6",
            secondary: `$${stats.lastMonthRevenue.toLocaleString()} last month`,
            secondaryColor: isDark ? "#f9a8d4" : "#9d174d",
          },
        ].map((card, index) => (

          <Grid item xs={12} sm={6} md={6} key={index} sx=sx={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}
          >
            <Card
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: card.bgColor,
                borderRadius: 2,
                boxShadow: isDark
                  ? "0 4px 6px rgba(0,0,0,0.3)"
                  : "0 4px 6px rgba(0,0,0,0.1)",
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: isDark
                    ? "0 10px 15px rgba(0,0,0,0.3)"
                    : "0 10px 15px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 3, flex: 1 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: card.textColor,
                        opacity: 0.8,
                        fontWeight: 500,
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: card.textColor,
                        fontWeight: 700,
                        mt: 0.5,
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: card.secondaryColor,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 1,
                      }}
                    >
                      {card.secondary}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      width: 44,
                      height: 44,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section - Side by Side */}
      <Grid container spacing={isTablet ? 2 : 3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
          <Card
            sx={{
              flex: 1,
              bgcolor: isDark ? "#1e1e1e" : "#ffffff",
              borderRadius: 2,
              boxShadow: isDark
                ? "0 4px 6px rgba(0,0,0,0.3)"
                : "0 4px 6px rgba(0,0,0,0.1)",
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: isDark ? "#e0f2fe" : "#1e3b8a",
                mb: 2,
                fontWeight: 600,
              }}
            >
              User Growth (Last 12 Months)
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatUserData()}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isDark ? "#3b82f6" : "#2563eb"}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={isDark ? "#3b82f6" : "#2563eb"}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                  />
                  <YAxis tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1f2937" : "#ffffff",
                      borderColor: isDark ? "#374151" : "#e5e7eb",
                      color: isDark ? "#f3f4f6" : "#111827",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke={isDark ? "#3b82f6" : "#2563eb"}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
          <Card
            sx={{
              flex:1,
              bgcolor: isDark ? "#1e1e1e" : "#ffffff",
              borderRadius: 2,
              boxShadow: isDark
                ? "0 4px 6px rgba(0,0,0,0.3)"
                : "0 4px 6px rgba(0,0,0,0.1)",
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: isDark ? "#e0f2fe" : "#1e3b8a",
                mb: 2,
                fontWeight: 600,
              }}
            >
              Orders & Revenue (Last 12 Months)
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatOrderData()}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1f2937" : "#ffffff",
                      borderColor: isDark ? "#374151" : "#e5e7eb",
                      color: isDark ? "#f3f4f6" : "#111827",
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="orders"
                    name="Orders"
                    fill={isDark ? "#8b5cf6" : "#7c3aed"}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    name="Revenue ($)"
                    fill={isDark ? "#10b981" : "#059669"}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Tables Section - Side by Side */}
      <Grid container spacing={isTablet ? 2 : 3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              bgcolor: isDark ? "#1e1e1e" : "#ffffff",
              borderRadius: 2,
              boxShadow: isDark
                ? "0 4px 6px rgba(0,0,0,0.3)"
                : "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                p: 2,
                color: isDark ? "#e0f2fe" : "#1e3b8a",
                fontWeight: 600,
                borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
              }}
            >
              Recent Orders
            </Typography>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: isDark ? "#111827" : "#f3f4f6",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#f3f4f6" : "#111827",
                      }}
                    >
                      Course
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#f3f4f6" : "#111827",
                      }}
                    >
                      User
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#f3f4f6" : "#111827",
                      }}
                      align="right"
                    >
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentOrders.map((order: any) => (
                    <TableRow
                      key={order._id || order.id}
                      hover
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: isDark ? "#e5e7eb" : "#111827" }}>
                        {order.courseId?.name ||
                          order.courses?.[0]?.name ||
                          "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: isDark ? "#e5e7eb" : "#111827" }}>
                        {order.userId?.name || order.userId?.email || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{ color: isDark ? "#e5e7eb" : "#111827" }}
                        align="right"
                      >
                        $
                        {(
                          order.payment_info?.amount ||
                          order.totalAmount ||
                          0
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              bgcolor: isDark ? "#1e1e1e" : "#ffffff",
              borderRadius: 2,
              boxShadow: isDark
                ? "0 4px 6px rgba(0,0,0,0.3)"
                : "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                p: 2,
                color: isDark ? "#e0f2fe" : "#1e3b8a",
                fontWeight: 600,
                borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
              }}
            >
              Recent Users
            </Typography>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: isDark ? "#111827" : "#f3f4f6",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#f3f4f6" : "#111827",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#f3f4f6" : "#111827",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#f3f4f6" : "#111827",
                      }}
                      align="right"
                    >
                      Joined
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentUsers.map((user: any) => (
                    <TableRow
                      key={user._id}
                      hover
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: isDark ? "#e5e7eb" : "#111827" }}>
                        {user.name}
                      </TableCell>
                      <TableCell sx={{ color: isDark ? "#e5e7eb" : "#111827" }}>
                        {user.email}
                      </TableCell>
                      <TableCell
                        sx={{ color: isDark ? "#e5e7eb" : "#111827" }}
                        align="right"
                      >
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;