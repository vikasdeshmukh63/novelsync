import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  industries: [],
  error: null,
  searchedIndustry: [],
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
};

const industriesSlice = createSlice({
  name: 'industry',
  initialState,
  reducers: {
    setIndustries: (state, action) => {
      state.industries = action.payload;
    },
    setSearchedIndustry: (state, action) => {
      state.searchedIndustry = action.payload;
    },
    hasError: (state, action) => {
      state.error = action.payload;
    },
    setPagination(state, action) {
      state.itemCount = action.payload.paginator.itemCount;
      state.perPage = action.payload.paginator.perPage;
      state.pageCount = action.payload.paginator.pageCount;
      state.currentPage = action.payload.paginator.currentPage;
    },
    setItemCount: (state, action) => {
      state.itemCount = action.payload;
    },
  },
});

export const {
  getIndustries,
  hasError,
  setSearchedIndustry,
  setIndustries,
  setPagination,
  setItemCount,
} = industriesSlice.actions;

export default industriesSlice.reducer;

// function to create industry
export function createIndustry(payload) {
  return async function createIndustryThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.industries.create, payload);

      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// function to update industry
export function editIndustry(id, payload) {
  return async function editIndustryThunk(dispatch) {
    try {
      const response = await axiosInstance.put(`${endpoints.industries.edit}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function searchIndustry(industry) {
  const payload = {
    query: {
      name: industry,
      isDeleted: false,
      isActive: true,
    },
    select: [],
    isCountOnly: false,
  };
  return async function searchIndustryThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.industries.search, payload);
      if (response.status === 200) {
        dispatch(setSearchedIndustry(response.data.data ?? []));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get Departments
export function fetchIndustrytList(page, rowsPerPage, isActive, value) {
  const payload = {
    query: {
      isDeleted: false,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: ['name', 'description', 'isActive', 'createdAt', 'id_str'],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };

  if (isActive !== undefined || isActive !== null) {
    payload.query.isActive = isActive;
  }
  return async function fetchIndustrytListThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.industries.list, payload);
      if (response.status === 200) {
        dispatch(setIndustries(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// function for delete department
export function deleteIndustry(id) {
  return async function deleteIndustryThunk(dispatch) {
    try {
      const response = await axiosInstance.put(`${endpoints.industries.delete}/${id}`);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// function to delete department
export function deleteIndustryByRowSelect(ids) {
  return async function ddeleteIndustryByRowSelectThunk(dispatch) {
    try {
      const response = await axiosInstance.put(`${endpoints.industries.deleteOnSelect}`, {
        ids,
      });
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// list search by industry
export function searchIndustryByQuery(page, rowsPerPage, name, filterValue) {
  const payload = {
    query: {
      isDeleted: false,
      name,
      isActive: filterValue,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: ['name', 'description', 'isActive', 'createdAt', 'id_str'],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };
  return async function searchIndustryByQueryThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.industries.search, payload);
      if (response.status === 200) {
        dispatch(setIndustries(response.data.data));
        dispatch(setItemCount(0));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
