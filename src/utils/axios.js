import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/admin/customers/me',
    login: '/admin/auth/login',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
  },
  proficiency: {
    list: '/guest/masters/list',
  },
  general: {
    languagesList: '/general/language/list',
    countries: '/general/countries/list',
  },
  industries: {
    create: '/admin/industries/create',
    edit: '/admin/industries/partial-update',
    delete: '/admin/industries/softDelete',
    deleteOnSelect: '/admin/industries/softDeleteMany',
    search: '/admin/industries/search',
    list: '/admin/industries/list',
  },
  departments: {
    create: '/admin/departments/create',
    edit: '/admin/departments/partial-update',
    delete: '/admin/departments/softDelete',
    deleteOnSelect: '/admin/departments/softDeleteMany',
    searchParent: '/admin/departments/search',
    list: '/admin/departments/list',
  },
  locations: {
    list: '/admin/locations/list',
    deleteSingle: `/admin/locations/softDelete`,
    deleteMultiple: '/admin/locations/softDeleteMany',
    search: '/admin/locations/search',
    create: '/admin/locations/create',
    edit: '/admin/locations/partial-update',
  },
  customers: {
    // list: '/admin/customers/list',
    // deleteSingle: `/admin/customers/softDelete`,
    // deleteMultiple: '/admin/customers/softDeleteMany',
    search: '/admin/customers/search',
    create: '/admin/customers/create',
    // edit: '/admin/customers/partial-update',
    list: '/admin/customers/list',
  },
  roles: {
    create: '/admin/fe_roles/create',
    edit: '/admin/fe_roles/partial-update',
    search: 'admin/fe_roles/search',
    list: '/admin/fe_roles/list',
    delete: '/admin/fe_roles/softDelete',
    deleteMany: '/admin/fe_roles/softDeleteMany',
  },
  userRoles: {
    search: '/admin/portal_roles/search',
    list: '/admin/portal_roles/list',
    create: '/admin/portal_roles/create',
    update: '/admin/portal_roles/partial-update',
    deleteMany: '/admin/portal_roles/softDeleteMany',
    delete: '/admin/portal_roles/softDelete',
    rolePermissions: '/admin/portal_role_permissions/list',
    setRolePermissions: '/admin/portal_role_permissions/addBulk',
  },
  userRolesPermissions: {
    list: '/admin/portal_permissions/list',
    create: '/admin/portal_permissions/create',
    update: '/admin/portal_permissions/partial-update',
    deleteMany: '/admin/portal_permissions/softDeleteMany',
    delete: '/admin/portal_permissions/softDelete',
  },
  organization: {
    createOrganization: '/admin/companies/create',
  },
  invites: {
    manualInvite: '/admin/customer_invites/addbulk',
    bulkInvite: '/admin/uploadInviteCustomers',
  },
  company: {
    search: '/admin/companies/search',
  },
};
