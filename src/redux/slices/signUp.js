import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  userInfo: null,
  error: null,
};

// ==============================|| SLICE - SIGNUP ||============================== //

const signup = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },

    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export default signup.reducer;

export const { setUserInfo, hasError } = signup.actions;

// ! function to get user
export function getMe() {
  const payload = {
    options: {
      include: [
        {
          model: 'fileuploads',
          as: '_fu_cv_id',
        },
        {
          model: 'fileuploads',
          as: '_prof_id',
        },
      ],
    },
  };
  return async function getMeThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(endpoints.auth.me);
      if (response.status === 200) {
        dispatch(setUserInfo(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
