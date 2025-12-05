import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {
  name: string;
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  user: any; // Replace with proper IUser type
  accessToken: string; // This is returned for convenience, but cookies are set
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // User registration endpoint
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      // Remove the onQueryStarted or fix it - registration doesn't log user in
      // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      //   try {
      //     const result = await queryFulfilled;
      //     // Registration doesn't automatically log user in
      //     // dispatch(userRegistration({ token: result.data.activationToken }));
      //   } catch (error) {
      //     console.log(error);
      //   }
      // },
    }),

    // Activation endpoint
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "activate-user",
        method: "POST",
        body: {
          activation_token,
          activation_code,
        },
      }),
    }),

    // Login endpoint - FIXED
    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: {
          email,
          password,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // Server returns { success: true, user, accessToken }
          dispatch(
            userLoggedIn({
              user: result.data.user, // Store user in Redux
            }),
          );
        } catch (error) {
          console.log("Login error:", error);
        }
      },
    }),

    // Social auth endpoint - FIXED
    socialAuth: builder.mutation<LoginResponse, { email: string; name: string; avatar: string }>({
      query: ({ email, name, avatar }) => ({
        url: "social-auth",
        method: "POST",
        body: {
          email,
          name,
          avatar,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              user: result.data.user, // Store user, not activationToken
            }),
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    // Logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogoutMutation,
} = authApi;