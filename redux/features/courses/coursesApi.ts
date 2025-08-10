// src/redux/features/courses/coursesApi.ts
import { apiSlice } from "../api/apiSlice";
interface IVideo {
  _id: string;
  title: string;
  description: string;
  videoUrl?:
    | string
    | {
        public_id: string;
        url: string;
      };
  videoLength: number;
  links: { title: string; url: string }[];
  suggestion?: string;
  questions: {
    user: any;
    question: string;
    questionReplies: any[];
    createdAt: Date;
  }[];
  reviews: {
    user: any;
    rating: number;
    comment: string;
    commentReplies: any[];
    createdAt: Date;
  }[];
  likes: string[];
  dislikes: string[];
}

interface ICourseData {
  _id: string;
  title: string;
  description: string;
  videoSection: string;
  videos: IVideo[];
}

interface ICourse {
  _id: string;
  name: string;
  description: string;
  categories: string;
  price: number;
  estimatedPrice?: number;
  tags: string;
  level: string;
  demoUrl?: {
    public_id: string;
    url: string;
  };
  thumbnail?: {
    public_id: string;
    url: string;
  };
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: {
    user: any;
    rating: number;
    comment: string;
    commentReplies: any[];
    createdAt: Date;
  }[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}
const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation<{ course: ICourse }, FormData>({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Courses"],
    }),

    getAllCourses: builder.query<ICourse[], void>({
      query: () => ({
        url: "get-courses",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response: { success: boolean; courses: ICourse[] }) =>
        response.courses,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Courses" as const, _id })),
              "Courses",
            ]
          : ["Courses"],
    }),

    deleteCourse: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Courses"],
    }),

    updateCourse: builder.mutation<
      { course: ICourse },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Courses", id: arg.id },
        "Courses",
      ],
    }),

    getCourse: builder.query<ICourse, string>({
      query: (id) => ({
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
    getFullCourse: builder.query<ICourse, string>({
      query: (id) => ({
        url: `get-full-course/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
    getCourseContent: builder.query<ICourse, string>({
      query: (id) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
    getUserCourses: builder.query<ICourse[], void>({
      query: () => ({
        url: "user/courses",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response: {
        success: boolean;
        courses: ICourse[];
      }) => {
        return response.courses || [];
      },
      providesTags: ["UserCourses"],
    }),
    checkCourseEnrollment: builder.query<
      {
        success: boolean;
        isEnrolled: boolean;
        message?: string;
      },
      string
    >({
      query: (courseId) => ({
        url: `user-courses/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["EnrollmentStatus"],
      transformErrorResponse: (response) => {
        console.log("Enrollment check error response:", response);
        return response;
      },
    }),
    // In your coursesApi.ts
    // markAsCompleted: builder.mutation<{
    //   success: boolean
    //   message: string
    // }, {
    //   userId: string
    //   courseId: string
    //   lectureId: string
    // }>({
    //   query: (data) => ({
    //     url: 'mark-lecture-completed',
    //     method: 'POST',
    //     body: data,
    //     credentials: 'include'
    //   }),
    //   invalidatesTags: ['UserCourses']
    // }),
    // Like/Dislike endpoints
    likeVideo: builder.mutation({
      query: ({ courseId, contentId }) => ({
        url: `like-video/${courseId}/${contentId}`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Courses"],
    }),

    dislikeVideo: builder.mutation({
      query: ({ courseId, contentId }) => ({
        url: `dislike-video/${courseId}/${contentId}`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Courses"],
    }),

    // Admin reply endpoint
    replyToReview: builder.mutation({
      query: ({ courseId, contentId, reviewId, reply }) => ({
        url: `reply-review/${courseId}/${contentId}/${reviewId}`,
        method: "PUT",
        body: { reply },
        credentials: "include",
      }),
      invalidatesTags: ["Courses"],
    }),

    addVideoReview: builder.mutation({
      query: ({ courseId, contentId, videoId, review }) => ({
        url: `add-video-review/${courseId}/${contentId}/${videoId}`,
        method: "POST",
        body: review,
        credentials: "include",
      }),
      invalidatesTags: ["CourseContent"],
    }),

    // Add a new endpoint to get video-specific data if needed
    getVideoData: builder.query({
      query: ({ courseId, contentId, videoId }) => ({
        url: `get-video-data/${courseId}/${contentId}/${videoId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["VideoContent"],
    }),
    replyToQuestion: builder.mutation({
      query: ({ courseId, contentId, questionId, reply }) => ({
        url: `reply-question/${courseId}/${contentId}/${questionId}`,
        method: "PUT",
        body: { reply },
        credentials: "include",
      }),
      invalidatesTags: ["CourseContent"],
    }),
    // Add these endpoints to your existing endpoints object

    addVideoQuestion: builder.mutation({
      query: ({ courseId, contentId, question }) => ({
        url: `add-question/${courseId}/${contentId}`,
        method: "POST",
        body: { question },
        credentials: "include",
      }),
      invalidatesTags: ["CourseContent"],
    }),
    // Add course review
    addCourseReview: builder.mutation({
      query: ({ courseId, ...body }) => ({
        url: `courses/${courseId}/reviews`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["CourseContent"],
    }),

    // Reply to course review
    replyToCourseReview: builder.mutation({
      query: ({ courseId, reviewId, ...body }) => ({
        url: `courses/${courseId}/reviews/${reviewId}/reply`,
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["CourseContent"],
    }),

    // Get course reviews
    getCourseReviews: builder.query({
      query: (courseId) => `courses/${courseId}/reviews`,
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
  useGetCourseQuery,
  useGetCourseContentQuery,
  useGetUserCoursesQuery,
  useCheckCourseEnrollmentQuery,
  // useMarkAsCompletedMutation,
  useLikeVideoMutation,
  useDislikeVideoMutation,
  useAddVideoReviewMutation,
  useGetVideoDataQuery,
  useReplyToReviewMutation,
  useReplyToQuestionMutation,
  useAddVideoQuestionMutation,
  useAddCourseReviewMutation,
  useReplyToCourseReviewMutation,
  useGetCourseReviewsQuery,
  useGetFullCourseQuery,
} = courseApi;
