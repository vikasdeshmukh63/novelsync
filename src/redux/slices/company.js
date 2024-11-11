import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const company = createSlice({
  name: 'company',
  initialState: {
    companies: [],
    error: null,
  },
  reducers: {
    // reducer to set companies data
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    // reducer to set the error
    hasError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCompanies, hasError } = company.actions;

export default company.reducer;

// ! function to search companies
export function searchCompanies(organization, isActive) {
  const payload = {
    query: {
      name: organization,
      isDeleted: false,
    },
    select: [],
    isCountOnly: false,
  };

  if (isActive !== undefined || isActive !== null) {
    payload.query.isActive = isActive;
  }

  return async function searchCompaniesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.company.search, payload);
      if (response.status === 200) {
        dispatch(setCompanies(response.data.data ?? []));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
