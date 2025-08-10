// notificationApi.ts
import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "get-all-notifications",
        method: "GET",
        credentials: "include" as const,
      }),
      // providesTags: ["Notifications"],
    }),
    updateNotificationStatus: builder.mutation({
      query: (id) => ({
        url: `update-notification/${id}`,
        method: "PUT",
        credentials: "include" as const,
      }),
      // invalidatesTags: ["Notifications"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `delete-notification/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      // invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation,
  useDeleteNotificationMutation,
} = notificationApi;
