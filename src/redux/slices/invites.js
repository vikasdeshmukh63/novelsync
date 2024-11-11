/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

// initial state
const initialState = {
  invitedData: [],
  error: null,
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
};

const invites = createSlice({
  name: 'invites',
  initialState,
  reducers: {
    // reducer to set pagination values
    setPagination(state, action) {
      state.itemCount = action.payload.paginator.itemCount;
      state.perPage = action.payload.paginator.perPage;
      state.pageCount = action.payload.paginator.pageCount;
      state.currentPage = action.payload.paginator.currentPage;
    },
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
    setManuallyInvitedData(state, action) {
      state.invitedData = action.payload;
    },
  },
});

export const { setPagination, hasError, setManuallyInvitedData } = invites.actions;

export default invites.reducer;

// ! function to manually add multiple candidates
export const manuallyAddEmployee = (payload) => async (dispatch) => {
  try {
    const response = await axiosInstance.post(endpoints.invites.manualInvite, payload);
    if (response.status === 200) {
      const filteredData = response.data.data.filter(
        (employee) => employee.isValidEmail === false || employee.isDuplicate === true
      );
      if (filteredData.length > 0) {
        dispatch(setManuallyInvitedData(filteredData));
        dispatch(hasError('Duplicate mail or Invalid email address'));
      } else {
        dispatch(hasError(null));
      }
    }
  } catch (err) {
    dispatch(hasError(err));
  }
};

export function uploadInviteFile(inviter_id, file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('inviter_id', inviter_id);
  return async function uploadInviteFileThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.invites.bulkInvite, formData);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
