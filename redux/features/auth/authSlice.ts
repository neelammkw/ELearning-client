import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
    // FIXED: Accepts user object only
    userLoggedIn: (state, action: PayloadAction<{ user: IUser }>) => {
      state.user = action.payload.user;
      state.error = null;
    },
    
    // Remove or fix userRegistration if not used
    // userRegistration: (state, action: PayloadAction<{ user: IUser }>) => {
    //   state.user = action.payload.user;
    //   state.error = null;
    // },
    
    userLoggedOut: (state) => {
      state.user = null;
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { 
  userLoggedIn, 
  userLoggedOut, 
  setLoading, 
  setError, 
  updateUser 
} = authSlice.actions;

export default authSlice.reducer;