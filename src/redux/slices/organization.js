import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  organizationData: {},
  error: null,
  errorOrg: '',
  createdOrgData: null,
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganizationData: (state, action) => {
      state.organizationData = { ...state.organizationData, ...action.payload };
    },
    hasError: (state, action) => {
      state.error = action.payload;
    },
    setAccError: (state, action) => {
      state.errorOrg = action.payload;
    },
    removeOrgData: (state, action) => {
      state.organizationData = action.payload;
    },
    createdOrgData: (state, action) => {
      state.createdOrgData = action.payload;
    },
  },
});

export const { setOrganizationData, hasError, setAccError, removeOrgData, createdOrgData } =
  organizationSlice.actions;
export default organizationSlice.reducer;

export function createOrganization(payload) {
  return async function createOrganizationThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.organization.createOrganization, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
        dispatch(removeOrgData(null));
        dispatch(createdOrgData(response.data.data));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}
