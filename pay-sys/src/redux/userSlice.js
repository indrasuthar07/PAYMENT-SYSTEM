import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    SetUser(state, action) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    SetLoading(state, action) {
      state.loading = action.payload;
    },
    SetError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    ClearUser(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    }
  }
});

export const {SetUser, SetLoading, SetError, ClearUser} = userSlice.actions;
export default userSlice.reducer;