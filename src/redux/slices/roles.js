import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  roles: [],
  rolePermissions: [],
  error: null,
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
};

const roles = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    // to set role data
    setRoles(state, action) {
      state.roles = action.payload;
    },
    // to set role permissions
    setRolePermissions(state, action) {
      state.rolePermissions = action.payload;
    },
    // to set pagination
    setPagination(state, action) {
      state.itemCount = action.payload.paginator.itemCount;
      state.perPage = action.payload.paginator.perPage;
      state.pageCount = action.payload.paginator.pageCount;
      state.currentPage = action.payload.paginator.currentPage;
    },
    // to set error
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setRoles, setRolePermissions, setPagination, hasError } = roles.actions;

export default roles.reducer;

// ! function to fetch roles
export function fetchRoles(page, rowsPerPage, status) {
  page += 1;
  const payload = {
    query: {
      isActive: status,
      isDeleted: false,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: ['id', 'name', 'description', 'isActive', 'isDeleted', 'createdAt'],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };

  return async function fetchRolesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.userRoles.list, payload);
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

// ! function to create roles
export function createRole(payload) {
  return async function createRolesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.userRoles.create, {
        ...payload,
        isActive: true,
      });
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to update roles
export function updateRole(payload, id) {
  return async function updateRolesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.userRoles.update}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to delelte many roles
export function deleteManyRoles(ids) {
  return async function deleteManyRolesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(endpoints.userRoles.deleteMany, { ids });
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to delete single role
export function deleteSingleRole(id) {
  return async function deleteSingleRoleThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.userRoles.delete}/${id}`);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to fetch role permissions
export function fetchRolePermissionsForRole(id) {
  const payload = {
    query: {
      role_id: id,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: [],
      page: 1,
      paginate: 1000,
    },
    isCountOnly: false,
  };
  return async function fetchRolePermissionsForRoleThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.userRoles.rolePermissions, payload);
      if (response.status === 200) {
        dispatch(setRolePermissions(response.data.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to set the role permissions
export function setRolePermissionsForRole(payload, id) {
  return async function setRolePermissionsForRoleThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(
        `${endpoints.userRoles.setRolePermissions}/${id}`,
        payload
      );
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function searchRoles(page, rowsPerPage, name, isActive = true) {
  const payload = {
    query: {
      isDeleted: false,
      isActive,
      name,
    },
    options: {
      sort: {
        createdAt: -1,
      },
      select: [],

      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };
  return async function searchRolesThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.userRoles.search, payload);
      if (response.status === 200) {
        dispatch(setRoles(response.data.data ?? []));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (err) {
      dispatch(hasError(err));
    }
  };
}
