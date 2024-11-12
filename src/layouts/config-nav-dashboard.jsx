import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: 'Dashboard',

    items: [
      {
        title: 'Dashboard',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
      },
    ],
  },

  // OVERVIEW
  // ----------------------------------------------------------------------
  {
    subheader: 'overview',
    items: [
      {
        title: 'employees',
        path: paths.overview.employees,
        icon: ICONS.dashboard,
      },
      {
        title: 'companies',
        path: paths.overview.companies,
        icon: ICONS.dashboard,
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'departments',
        path: paths.management.departments,
        icon: ICONS.dashboard,
      },
      {
        title: 'locations',
        path: paths.management.locations,
        icon: ICONS.dashboard,
      },
      {
        title: 'skills',
        path: paths.management.skills,
        icon: ICONS.dashboard,
      },
      {
        title: 'industries',
        path: paths.management.industries,
        icon: ICONS.dashboard,
      },
    ],
  },

  // ADMINISTRATION
  // ----------------------------------------------------------------------
  {
    subheader: 'Administration',
    items: [
      {
        title: 'users',
        path: paths.administration.users,
        icon: ICONS.dashboard,
      },
      {
        title: 'orders',
        path: paths.administration.orders,
        icon: ICONS.dashboard,
      },
      {
        title: 'Roles',
        path: paths.administration.roles,
        icon: ICONS.dashboard,
      },
      {
        title: 'Permissions',
        path: paths.administration.permissions,
        icon: ICONS.dashboard,
      },
    ],
  }
];
