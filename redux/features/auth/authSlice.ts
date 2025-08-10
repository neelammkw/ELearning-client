import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  user: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: string }>,
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      // Cookies.set('access_token', action.payload.accessToken);
    },
    userLoggedOut: (state) => {
      state.token = null;
      state.user = null;

      // Cookies.remove('access_token');
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } =
  authSlice.actions;
export default authSlice.reducer;
