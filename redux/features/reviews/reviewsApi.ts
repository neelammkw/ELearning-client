import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICourse } from "../courses/coursesApi";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    getCourseReviews: builder.query<ICourse["reviews"], string>({
      query: (courseId) => `reviews?courseId=${courseId}`,
      transformResponse: (response: { success: boolean; reviews: any }) =>
        response.reviews,
      providesTags: (result, error, courseId) => [
        { type: "Reviews" as const, id: courseId },
        "Reviews",
      ],
    }),
    addCourseReview: builder.mutation({
      query: ({ courseId, rating, comment }) => ({
        url: `reviews`,
        method: "POST",
        body: { courseId, rating, comment },
        credentials: "include",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Reviews", id: courseId },
        "Courses",
      ],
    }),
    addReviewReply: builder.mutation({
      query: ({ courseId, reviewId, comment }) => ({
        url: `reviews/reply`,
        method: "PUT",
        body: { courseId, reviewId, comment },
        credentials: "include",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Reviews", id: courseId },
      ],
    }),
  }),
});

export const {
  useGetCourseReviewsQuery,
  useAddCourseReviewMutation,
  useAddReviewReplyMutation,
} = reviewsApi;
