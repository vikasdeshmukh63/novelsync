import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const locations = createSlice({
  name: 'locations',
  initialState: {
    locations: [],
    itemCount: 0,
    perPage: 0,
    pageCount: 0,
    currentPage: 0,
    error: null,
  },
  reducers: {
    // reducer to set location data
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    // reducer to set pagination values
    setPagination: (state, action) => {
      state.itemCount = action.payload.paginator.itemCount;
      state.perPage = action.payload.paginator.perPage;
      state.pageCount = action.payload.paginator.pageCount;
      state.currentPage = action.payload.paginator.currentPage;
    },
    // reducer to set itemCount
    setItemCount: (state, action) => {
      state.itemCount = action.payload;
    },
    // reducer to set the error
    hasError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLocations, setItemCount, setPagination, hasError } = locations.actions;

export default locations.reducer;

// ! function to get location list
export function fetchLocationList(page, rowsPerPage, isActive, company_id) {
  page += 1;
  const payload = {
    query: {
      isDeleted: false,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: [
        'name',
        'id_str',
        'isActive',
        'createdAt',
        'house',
        'street',
        'ishq',
        'city',
        'state',
        'country_id',
        'zipcode',
      ],
      include: [
        {
          model: 'companies',
          as: '_company_id',
        },
      ],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };

  if (isActive !== undefined || isActive !== null) {
    payload.query.isActive = isActive;
  }

  if (company_id !== undefined || isActive !== null) {
    payload.query.company_id = company_id;
  }

  return async function fetchLocationListThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.locations.list, payload);
      if (response.status === 200) {
        dispatch(setLocations(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to delete single location
export function deleteSingleLocation(id) {
  return async function deleteSingleLocationThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.locations.deleteSingle}/${id}`);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to delete multiple locations
export function deleteMultipleLocations(ids) {
  const payload = {
    ids,
  };
  return async function deleteMultipleLocationsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(endpoints.locations.deleteMultiple, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to search the locations
export function searchLocations(query, isActive) {
  const payload = {
    query: {
      isDeleted: false,
      name: query,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: [
        'name',
        'id_str',
        'isActive',
        'createdAt',
        'house',
        'street',
        'ishq',
        'city',
        'state',
        'country_id',
        'zipcode',
      ],
      include: [
        {
          model: 'companies',
          as: '_company_id',
        },
      ],
      page: 1,
      paginate: 1000,
    },
    isCountOnly: false,
  };

  if (isActive !== undefined || isActive !== null) {
    payload.query.isActive = isActive;
  }
  return async function searchLocationThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.locations.search, payload);
      if (response.status === 200) {
        dispatch(setLocations(response.data.data ?? []));
        dispatch(setItemCount(0));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to create location
export function createLocation(payload) {
  return async function createLocationThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.locations.create, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to edit location
export function editLocation(id, payload) {
  return async function editLocationThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.locations.edit}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
