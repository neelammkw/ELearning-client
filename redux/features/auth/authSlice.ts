import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
}

interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user after successful login
    userLoggedIn: (state, action: PayloadAction<{ user: IUser }>) => {
      state.user = action.payload.user;
      state.error = null;
      // DO NOT set cookies here! They're set by the server
    },
    
    // Registration - just store user if needed
    userRegistration: (state, action: PayloadAction<{ user: IUser }>) => {
      state.user = action.payload.user;
      state.error = null;
    },
    
    // Clear user on logout
    userLoggedOut: (state) => {
      state.user = null;
      state.error = null;
      // Cookies are cleared by the server on logout
      // You might need to call your logout API endpoint
    },
    
    // Update loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Update error state
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Update user info
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { 
  userLoggedIn, 
  userRegistration, 
  userLoggedOut, 
  setLoading, 
  setError, 
  updateUser 
} = authSlice.actions;

export default authSlice.reducer;