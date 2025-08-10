import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Existing endpoints
    updateProfile: builder.mutation({
      query: ({ name }) => ({
        url: "update-userinfo",
        method: "PUT",
        body: { name },
        credentials: "include" as const,
      }),
    }),
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "update-user-password",
        method: "PUT",
        body: { oldPassword, newPassword },
        credentials: "include" as const,
      }),
    }),

    // New endpoints for user management
    getAllUsers: builder.query({
      query: () => ({
        url: "get-users",
        method: "GET",
        credentials: "include" as const,
      }),
      transformResponse: (response: { success: boolean; users: IUsers[] }) =>
        response.users,
      // providesTags: ['Users'], // For cache invalidation
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `delete-user/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Users"], // Invalidate cache when user is deleted
    }),

    // In your userApi.ts
    updateUserRole: builder.mutation({
      query: ({ email, role }) => {
        console.log("Sending update request:", { email, role }); // Debug log
        return {
          url: `update-user-role`,
          method: "PUT",
          body: { email, role },
          credentials: "include" as const,
        };
      },
      invalidatesTags: ["Users"],
      // Add transformErrorResponse to handle errors consistently
      transformErrorResponse: (response: any) => {
        console.error("Update role error response:", response); // Debug log
        return response.data;
      },
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: "registration",
        method: "POST",
        body: userData,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Users"],
      transformErrorResponse: (response: any) => {
        console.error("Create User error response:", response); // Debug log
        return response.data;
      },
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useUpdatePasswordMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useCreateUserMutation,
} = userApi;
