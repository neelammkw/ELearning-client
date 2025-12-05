import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    credentials: "include", // CRITICAL: Add this line
    prepareHeaders: (headers, { getState }) => {
      // Optional: Add any custom headers if needed
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Courses",
    "UserCourses",
    "Orders",
    "UserOrders",
    "Layout",
    "EnrollmentStatus",
    "CourseContent",
    "VideoContent",
    "UserOrders",
    "Analytics",
  ] as const,
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "refresh",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // FIX: The server returns { success: true, user } NOT activationToken
          dispatch(
            userLoggedIn({
              user: result.data.user, // Changed from activationToken
            }),
          );
        } catch (error) {
          console.log("Load user error:", error);
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;