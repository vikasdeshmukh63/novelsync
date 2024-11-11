// third-party
import { createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

// initial state
const initialState = {
  nationalId: [],
  error: null,
};

// ==============================|| SLICE - PROFICIENCIES ||============================== //

const proficiencies = createSlice({
  name: 'proficiencies',
  initialState,
  reducers: {
    setNationalId(state, action) {
      state.nationalId = action.payload;
    },
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setNationalId, hasError } = proficiencies.actions;

export default proficiencies.reducer;

// ! funciton to fetch national ids
export const fetchNationalId = () => async (dispatch) => {
  const payload = {
    query: {
      type: 'NID_TYPES',
      isDeleted: false,
      isActive: true,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: [
        'id',
        'type',
        'name',
        'value',
        'parent',
        'isDeleted',
        'isActive',
        'createdAt',
        'updatedAt',
        'addedBy',
      ],
      page: 1,
      paginate: 1000,
    },
    isCountOnly: false,
  };
  try {
    const response = await axiosInstance.post(endpoints.proficiency.list, payload);
    if (response.status === 200) {
      dispatch(setNationalId(response.data.data.data));
      dispatch(hasError(null));
    }
  } catch (error) {
    dispatch(hasError(error));
  }
};
