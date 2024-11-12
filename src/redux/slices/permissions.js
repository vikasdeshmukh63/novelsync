import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  permissions: [],
  error: null,
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
};

const permissions = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    // to set role data
    setPermissions(state, action) {
      state.permissions = action.payload;
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

export const { setPermissions, setPagination, hasError } = permissions.actions;

export default permissions.reducer;

// ! function to fetch permissions
export function fetchPermissions(page, rowsPerPage, status) {
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
      select: [],
      page,
      paginate: rowsPerPage,
    },
    isCountOnly: false,
  };

  return async function fetchPermissionsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.userRolesPermissions.list, payload);
      if (response.status === 200) {
        dispatch(setPermissions(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to create permissions
export function createPermission(payload) {
  return async function createPermissionThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.userRolesPermissions.create, {
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

// ! function to update permissions
export function udpatePermissions(payload, id) {
  return async function udpatePermissionsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(
        `${endpoints.userRolesPermissions.update}/${id}`,
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

// ! function to delelte many permissions
export function deleteManyPermissions(ids) {
  return async function deleteManyPermissionsThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(endpoints.userRolesPermissions.deleteMany, { ids });
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to delete single permission
export function deleteSinglePermission(id) {
  return async function deleteSinglePermissionThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.put(`${endpoints.userRolesPermissions.delete}/${id}`);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
