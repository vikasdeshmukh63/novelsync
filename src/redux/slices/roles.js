import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  roles: [],
  error: null,
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setRoles: (state, action) => {
      state.roles = action.payload;
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

export const { setRoles, hasError, setPagination, setItemCount } = rolesSlice.actions;

export default rolesSlice.reducer;

// creating roles slice
export function createRoles(payload) {
  return async function createRolesThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.roles.create, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// updating roles slice
export function editRoles(id, payload) {
  return async function editRolesThunk(dispatch) {
    try {
      const response = await axiosInstance.put(`${endpoints.roles.edit}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// creating roles slice
export function deleteRoles(id) {
  return async function deleteRolesThunk(dispatch) {
    try {
      const response = await axiosInstance.put(`${endpoints.roles.delete}/${id}`);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// creating roles multiple select
export function deleteRolesByRowSelect(ids) {
  return async function deleteRolesByRowSelectThunk(dispatch) {
    try {
      const response = await axiosInstance.put(`${endpoints.roles.deleteMany}`, { ids });
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// to get Roles list

export function fetchRolesList(page, rowsPerPage, isActive) {
  const payload = {
    query: {
      isDeleted: false,
    },
    options: {
      select: ['name', 'desc', 'isActive', 'createdAt', 'id_str'],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };
  if (isActive !== undefined || isActive !== null) {
    payload.query.isActive = isActive;
  }
  return async function fetchRolesListThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.roles.list, payload);
      if (response.status === 200) {
        dispatch(setRoles(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function searchRoleByQuery(page, rowsPerPage, name, filterValue) {
  const payload = {
    query: {
      isDeleted: false,
      name,
      isActive: filterValue,
    },
    options: {
      select: ['name', 'desc', 'isActive', 'createdAt', 'id_str'],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };
  return async function searchRoleByQueryThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.roles.search, payload);
      if (response.status === 200) {
        dispatch(setRoles(response.data.data));
        dispatch(setItemCount(0));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
