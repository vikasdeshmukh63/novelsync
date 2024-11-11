import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const customers = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    itemCount: 0,
    perPage: 0,
    pageCount: 0,
    currentPage: 0,
    error: null,
    isLoading: false,
  },
  reducers: {
    // reducer to set customers data
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    // reducer to set pagination values
    setPagination(state, action) {
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
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCustomers, setItemCount, setPagination, hasError, setIsLoading } =
  customers.actions;

export default customers.reducer;

export function fetchCustomersList(page, rowsPerPage) {
  const payload = {
    query: {
      isDeleted: false,
      userType: 2,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: [],
      include: [
        {
          model: 'customers_extras',
          include: [
            {
              model: 'fileuploads',
              as: '_fu_cv_id',
            },
            {
              model: 'fileuploads',
              as: '_prof_id',
            },
            {
              model: 'job_titles',
              as: '_job_title_id',
            },
          ],
        },
      ],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };
  return async function fetchCustomersListThunk(dispatch, getState) {
    dispatch(setIsLoading(true));
    try {
      const response = await axiosInstance.post(endpoints.customers.list, payload);
      if (response.status === 200) {
        dispatch(setCustomers(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(setIsLoading(false));
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(setIsLoading(false));
      dispatch(hasError(err));
    }
  };
}

export function searchCustomersList(page, rowsPerPage, name) {
  const payload = {
    query: {
      isDeleted: false,
      userType: 2,
      name,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: [],
      include: [
        {
          model: 'customers_extras',
          include: [
            {
              model: 'fileuploads',
              as: '_fu_cv_id',
            },
            {
              model: 'fileuploads',
              as: '_prof_id',
            },
            {
              model: 'job_titles',
              as: '_job_title_id',
            },
          ],
        },
      ],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };
  return async function searchCustomersListThunk(dispatch, getState) {
    dispatch(setIsLoading(true));
    try {
      const response = await axiosInstance.post(endpoints.customers.search, payload);
      if (response.status === 200) {
        dispatch(setCustomers(response.data.data ?? []));
        dispatch(setPagination(response.data.data));
        dispatch(setIsLoading(false));
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(setIsLoading(false));
      dispatch(hasError(err));
    }
  };
}

// ! function to delete multiple customers
export function deleteMultipleCustomers(ids) {
  const payload = {
    ids,
  };
  return async function deleteMultipleCustomersThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(endpoints.customers.deleteMultiple, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}
