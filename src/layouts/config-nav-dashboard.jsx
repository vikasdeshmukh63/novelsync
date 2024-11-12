import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  course: icon('ic_course'),
  company: icon('ic_company'),
  hire: icon('ic-mingcute_flash-fill'),
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
        icon: ICONS.user,
      },
      {
        title: 'companies',
        path: paths.overview.companies,
        icon: ICONS.company,
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
        icon: ICONS.folder,
      },
      {
        title: 'locations',
        path: paths.management.locations,
        icon: ICONS.calendar,
      },
      {
        title: 'skills',
        path: paths.management.skills,
        icon: ICONS.label,
      },
      {
        title: 'industries',
        path: paths.management.industries,
        icon: ICONS.analytics,
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
        icon: ICONS.user,
      },
      {
        title: 'orders',
        path: paths.administration.orders,
        icon: ICONS.dashboard,
      },
      {
        title: 'Roles',
        path: paths.administration.roles,
        icon: ICONS.lock,
      },
      {
        title: 'orders',
        path: paths.administration.orders,
        icon: ICONS.order,
      },
    ],
  }
];
