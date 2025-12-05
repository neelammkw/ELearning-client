import { apiSlice } from "../api/apiSlice";

// Define proper TypeScript interfaces
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// For user registration
interface IRegistrationData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Update user profile
    updateProfile: builder.mutation({
      query: ({ name }) => ({
        url: "update-userinfo",
        method: "PUT",
        body: { name },
        credentials: "include" as const,
      }),
      // Add optimistic updates for better UX
      async onQueryStarted({ name }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update user in cache if needed
          // dispatch(userApi.util.updateQueryData('getUserInfo', undefined, (draft) => {
          //   Object.assign(draft, data.user);
          // }));
        } catch (error) {
          console.error('Update profile error:', error);
        }
      },
    }),

    // Update avatar
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),
    }),

    // Update password
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "update-user-password",
        method: "PUT",
        body: { oldPassword, newPassword },
        credentials: "include" as const,
      }),
    }),

    // Get all users (admin only)
    getAllUsers: builder.query<IUser[], void>({
      query: () => ({
        url: "get-users",
        method: "GET",
        credentials: "include" as const,
      }),
      // Add proper type for transformResponse
      transformResponse: (response: { success: boolean; users?: IUser[] }) => {
        return response.users || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Users' as const, id: _id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // Delete user (admin only)
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `delete-user/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // Update user role (admin only)
    updateUserRole: builder.mutation({
      query: ({ email, role }: { email: string; role: string }) => ({
        url: "update-user-role",
        method: "PUT",
        body: { email, role },
        credentials: "include" as const,
      }),
      invalidatesTags: (_result, _error, { email }) => [
        { type: 'Users', id: email },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // Create user (registration)
    createUser: builder.mutation({
      query: (userData: IRegistrationData) => ({
        url: "registration",
        method: "POST",
        body: userData,
        credentials: "include" as const,
      }),
      // Don't invalidate all users on registration unless it's admin creating user
      // invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    // ADD THESE CRITICAL ENDPOINTS:
    
    // Get current user info
    getUserInfo: builder.query<IUser, void>({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include" as const,
      }),
      transformResponse: (response: { success: boolean; user: IUser }) => {
        return response.user;
      },
      // providesTags: ['User'],
    }),

    // Logout user
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Login user
    loginUser: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "login",
        method: "POST",
        body: credentials,
        credentials: "include" as const,
      }),
    }),

    // Refresh token
    refreshToken: builder.query({
      query: () => ({
        url: "refresh",
        method: "GET",
        credentials: "include" as const,
      }),
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
  useGetUserInfoQuery,     // NEW
  useLogoutUserMutation,   // NEW
  useLoginUserMutation,    // NEW
  useRefreshTokenQuery,    // NEW
} = userApi;