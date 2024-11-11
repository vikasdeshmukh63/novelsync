import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  departments: [],
  error: null,
  parentDepartments: [],
  itemCount: 0,
  perPage: 0,
  pageCount: 0,
  currentPage: 0,
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    setDepartments: (state, action) => {
      state.departments = action.payload;
    },
    hasError: (state, action) => {
      state.error = action.payload;
    },
    setParentDepartments: (state, action) => {
      state.parentDepartments = action.payload;
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

export const { setDepartments, hasError, setParentDepartments, setPagination, setItemCount } =
  departmentSlice.actions;

export default departmentSlice.reducer;

// function to create department
export function createDepartment(payload) {
  return async function createDepartmentThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.departments.create, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// function to update department
export function editDepartment(id, payload) {
  return async function editDepartmentThunk(dispatch) {
    try {
      const response = await axiosInstance.put(`${endpoints.departments.edit}/${id}`, payload);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// function to delete department
export function deleteDepartment(id) {
  return async function deleteDepartmentThunk(dispatch) {
    try {
      const response = await axiosInstance.put(`${endpoints.departments.delete}/${id}`);
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// function to delete department
export function deleteDepartmentByRowSelect(ids) {
  return async function deleteDepartmentByRowSelectThunk(dispatch) {
    try {
      const response = await axiosInstance.put(`${endpoints.departments.deleteOnSelect}`, { ids });
      if (response.status === 200) {
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

//  function to search parent department
export function searchParentDepartment(departmentName) {
  const payload = {
    query: {
      name: departmentName,
      isDeleted: false,
      isActive: true,
    },
    select: [],
    isCountOnly: false,
  };
  return async function searchParentDepartmentThunk(dispatch) {
    try {
      const response = await axiosInstance.post(endpoints.departments.searchParent, payload);
      if (response.status === 200) {
        dispatch(setParentDepartments(response.data.data ?? []));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// ! function to get Departments
export function fetchDepartmentList(page, rowsPerPage, isActive, company_id) {
  const payload = {
    query: {
      isDeleted: false,
    },
    options: {
      select: ['id', 'name', 'short_name', 'isActive', 'createdAt', 'id_str'],
      include: [
        {
          model: 'companies',
          as: '_company_id',
        },
        {
          model: 'department_locations',
          include: [
            {
              model: 'locations',
              as: '_location_id',
            },
          ],
        },
        {
          model: 'departments',
          as: '_parent_department_id',
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
  return async function fetchDepartmentListThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.departments.list, payload);
      if (response.status === 200) {
        dispatch(setDepartments(response.data.data.data));
        dispatch(setPagination(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function searchDepartmentList(page, rowsPerPage, isActive, query) {
  const payload = {
    query: {
      isDeleted: false,
      name: query,
    },
    options: {
      select: ['id', 'name', 'short_name', 'isActive', 'createdAt', 'id_str'],
      include: [
        {
          model: 'companies',
          as: '_company_id',
        },
        {
          model: 'department_locations',
          include: [
            {
              model: 'locations',
              as: '_location_id',
            },
          ],
        },
        {
          model: 'departments',
          as: '_parent_department_id',
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
  return async function searchDepartmentListThunk(dispatch, getState) {
    try {
      const response = await axiosInstance.post(endpoints.departments.searchParent, payload);
      if (response.status === 200) {
        dispatch(setDepartments(response.data.data));
        dispatch(setItemCount(response.data.data.length));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
