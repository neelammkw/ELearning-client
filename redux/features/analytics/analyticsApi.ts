import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get course analytics
    getCoursesAnalytics: builder.query({
      query: () => ({
        url: "get-courses-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Get orders analytics
    getOrdersAnalytics: builder.query({
      query: () => ({
        url: "get-orders-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Get users analytics
    getUsersAnalytics: builder.query({
      query: () => ({
        url: "get-users-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Get all analytics (combined)
    getAllAnalytics: builder.query({
      query: () => ({
        url: "get-all-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetCoursesAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
  useGetAllAnalyticsQuery,
} = analyticsApi;
