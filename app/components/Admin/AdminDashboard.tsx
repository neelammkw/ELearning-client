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
  const isMediumScreen = useMediaQuery("(max-width:960px)");

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
        p: isMobile ? 1 : 1,
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <DashboardHero title="Admin Dashboard" />

      {/* Summary Cards - Full width with even spacing */}
      <Grid
        container
        spacing={isMobile ? 1 : 2}
        sx={{
          mb: 4,
          justifyContent: "space-between",
        }}
      >
        {[
          {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: <PeopleIcon color={isDark ? "#fff" : "#3f51b5"} />,
            bgColor: isDark ? "#3f51b5" : "#e3f2fd",
            secondary: `${Math.abs(stats.userGrowth).toFixed(1)}% ${stats.userGrowth >= 0 ? "↑" : "↓"}`,
            secondaryColor: stats.userGrowth >= 0 ? "#4caf50" : "#f44336",
            iconComponent: (
              <GrowthIcon
                size={16}
                color={stats.userGrowth >= 0 ? "#4caf50" : "#f44336"}
              />
            ),
          },
          {
            title: "Total Courses",
            value: stats.totalCourses.toLocaleString(),
            icon: <CourseIcon color={isDark ? "#fff" : "#2196f3"} />,
            bgColor: isDark ? "#2196f3" : "#e3f2fd",
            secondary: `${stats.totalEnrollments.toLocaleString()} enrollments`,
            secondaryColor: isDark ? "#4fc3f7" : "#0288d1",
          },
          {
            title: "Total Orders",
            value: stats.totalOrders.toLocaleString(),
            icon: <OrderIcon color={isDark ? "#fff" : "#388e3c"} />,
            bgColor: isDark ? "#4caf50" : "#e8f5e9",
            secondary: `+${stats.lastMonthOrders} this month`,
            secondaryColor: isDark ? "#81c784" : "#388e3c",
          },
          {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: <RevenueIcon color={isDark ? "#fff" : "#f57c00"} />,
            bgColor: isDark ? "#ff9800" : "#fff3e0",
            secondary: `$${stats.lastMonthRevenue.toLocaleString()} last month`,
            secondaryColor: isDark ? "#ffb74d" : "#f57c00",
          },
        ].map((card, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={5.8}
            md={2.8}
            lg={2.8}
            sx={{
              minWidth: isMobile ? "100%" : "auto",
              flexGrow: 1,
            }}
          >
            <Card
              sx={{
                bgcolor: isDark ? "#2a2a40" : "#ffffff",
                borderRadius: 3,
                boxShadow: isDark
                  ? "0 4px 20px rgba(0,0,0,0.2)"
                  : "0 4px 20px rgba(0,0,0,0.05)",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <div className="flex items-center justify-between">
                  <div>
                    <Typography
                      color="text.secondary"
                      gutterBottom
                      variant={isMobile ? "body2" : "body1"}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant={isMobile ? "h5" : "h4"}
                      component="div"
                      sx={{ fontWeight: 700 }}
                    >
                      {card.value}
                    </Typography>
                    <div className="flex items-center mt-1">
                      {card.iconComponent && <>{card.iconComponent}</>}
                      <Typography
                        variant="body2"
                        sx={{
                          ml: card.iconComponent ? 0.5 : 0,
                          color: card.secondaryColor,
                        }}
                      >
                        {card.secondary}
                      </Typography>
                    </div>
                  </div>
                  <Avatar
                    sx={{
                      bgcolor: card.bgColor,
                      width: isMobile ? 40 : 56,
                      height: isMobile ? 40 : 56,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section - Full width with responsive layout */}
      <Grid
        container
        spacing={isMobile ? 2 : 3}
        sx={{
          mb: 4,
          width: '100%',
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        {/* User Growth Chart - Full width on mobile, half on desktop */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            paddingLeft: '0 !important',
            paddingRight: isMobile ? '0 !important' : '8px !important',
          }}
        >
          <Card
            sx={{
              bgcolor: isDark ? '#2a2a40' : '#ffffff',
              p: isMobile ? 1 : 2,
              borderRadius: 3,
              boxShadow: isDark
                ? '0 4px 20px rgba(0,0,0,0.2)'
                : '0 4px 20px rgba(0,0,0,0.05)',
              width: '100%',
              height: '100%',
            }}
          >
            <Typography
              variant={isMobile ? 'subtitle1' : 'h6'}
              gutterBottom
              sx={{
                fontWeight: 600,
                color: isDark ? '#fff' : 'inherit',
              }}
            >
              User Growth (Last 12 Months)
            </Typography>
            <div style={{
              height: isMobile ? 250 : 300,
              width: '100%',
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatUserData()}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? '#555' : '#eee'}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: isDark ? '#fff' : '#666' }}
                  />
                  <YAxis tick={{ fill: isDark ? '#fff' : '#666' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>

        {/* Orders & Revenue Chart - Full width on mobile, half on desktop */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            paddingLeft: isMobile ? '0 !important' : '8px !important',
            paddingRight: '0 !important',
          }}
        >
          <Card
            sx={{
              bgcolor: isDark ? '#2a2a40' : '#ffffff',
              p: isMobile ? 1 : 2,
              borderRadius: 3,
              boxShadow: isDark
                ? '0 4px 20px rgba(0,0,0,0.2)'
                : '0 4px 20px rgba(0,0,0,0.05)',
              width: '100%',
              height: '100%',
            }}
          >
            <Typography
              variant={isMobile ? 'subtitle1' : 'h6'}
              gutterBottom
              sx={{
                fontWeight: 600,
                color: isDark ? '#fff' : 'inherit',
              }}
            >
              Orders & Revenue (Last 12 Months)
            </Typography>
            <div style={{
              height: isMobile ? 250 : 300,
              width: '100%',
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatOrderData()}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? '#555' : '#eee'}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: isDark ? '#fff' : '#666' }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#8884d8"
                    tick={{ fill: isDark ? '#fff' : '#666' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#82ca9d"
                    tick={{ fill: isDark ? '#fff' : '#666' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="orders"
                    name="Orders"
                    fill="#8884d8"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    name="Revenue ($)"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>
      </Grid>
      {/* Tables Section - Side by side on desktop */}
      <Grid
        container
        spacing={isMobile ? 2 : 2}
        sx={{
          width: "100%",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            paddingLeft: "0 !important",
          }}
        >
          <Card
            sx={{
              bgcolor: isDark ? "#2a2a40" : "#ffffff",
              p: isMobile ? 1 : 2,
              borderRadius: 3,
              boxShadow: isDark
                ? "0 4px 20px rgba(0,0,0,0.2)"
                : "0 4px 20px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              gutterBottom
              sx={{
                fontWeight: 600,
                color: isDark ? "#fff" : "inherit",
              }}
            >
              Recent Orders
            </Typography>
            <TableContainer
              sx={{
                bgcolor: "transparent",
                boxShadow: "none",
                maxHeight: isMobile ? 250 : 350,
              }}
            >
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? "#1e1e2d" : "#f5f5f5" }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#fff" : "inherit",
                      }}
                    >
                      Course
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#fff" : "inherit",
                      }}
                    >
                      User
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#fff" : "inherit",
                      }}
                      align="right"
                    >
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentOrders.map((order: any) => (
                    <TableRow key={order._id || order.id} hover>
                      <TableCell sx={{ color: isDark ? "#fff" : "inherit" }}>
                        {order.courseId?.name ||
                          order.courses?.[0]?.name ||
                          "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: isDark ? "#fff" : "inherit" }}>
                        {order.userId?.name || order.userId?.email || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{ color: isDark ? "#fff" : "inherit" }}
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

        <Grid
          item
          xs={12}
          md={5}
          sx={{
            paddingLeft: isMediumScreen ? "0 !important" : "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <Card
            sx={{
              bgcolor: isDark ? "#2a2a40" : "#ffffff",
              p: isMobile ? 1 : 2,
              borderRadius: 3,
              boxShadow: isDark
                ? "0 4px 20px rgba(0,0,0,0.2)"
                : "0 4px 20px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              gutterBottom
              sx={{
                fontWeight: 600,
                color: isDark ? "#fff" : "inherit",
              }}
            >
              Recent Users
            </Typography>
            <TableContainer
              sx={{
                bgcolor: "transparent",
                boxShadow: "none",
                maxHeight: isMobile ? 250 : 350,
              }}
            >
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? "#1e1e2d" : "#f5f5f5" }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#fff" : "inherit",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#fff" : "inherit",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: isDark ? "#fff" : "inherit",
                      }}
                      align="right"
                    >
                      Joined
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentUsers.map((user: any) => (
                    <TableRow key={user._id} hover>
                      <TableCell sx={{ color: isDark ? "#fff" : "inherit" }}>
                        {user.name}
                      </TableCell>
                      <TableCell sx={{ color: isDark ? "#fff" : "inherit" }}>
                        {user.email}
                      </TableCell>
                      <TableCell
                        sx={{ color: isDark ? "#fff" : "inherit" }}
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
