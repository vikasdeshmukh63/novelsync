import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const general = createSlice({
  name: 'general',
  initialState: {
    countries: [],
    languages: [],
    error: null,
  },
  reducers: {
    // reducer to set countries data
    setCountries: (state, action) => {
      state.countries = action.payload;
    },
    // reducer to set the error
    hasError: (state, action) => {
      state.error = action.payload;
    },
    setLanguages(state, action) {
      state.languages = action.payload;
    },
  },
});

export const { setCountries, hasError, setLanguages } = general.actions;

export default general.reducer;

// ! function to get countries
export function fetchCountries() {
  return async function fetchCountriesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.get(endpoints.general.countries);
      if (response.status === 200) {
        const sortedData = response.data.data
          .slice()
          .sort((a, b) => parseInt(a.dial_code, 10) - parseInt(b.dial_code, 10));
        dispatch(setCountries(sortedData));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to fetch languages
export const fetchLanguages = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get(endpoints.general.languagesList);
    if (response.status === 200) {
      dispatch(setLanguages(response.data.data));
      dispatch(hasError(null));
    }
  } catch (error) {
    dispatch(hasError(error));
  }
};
