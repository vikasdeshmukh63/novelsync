// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  MANAGEMENT: '/management',
  ADMINISTRATION: '/administration',
  OVERVIEW: '/overview',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/signin`,
      signUp: `${ROOTS.AUTH}/signup`,
      forgotPassword: `${ROOTS.AUTH}/forgotpassword`,
      register: `${ROOTS.AUTH}/register`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },

  overview: {
    employees: `${ROOTS.OVERVIEW}/employees`,
    companies: `${ROOTS.OVERVIEW}/companies`,
  },
  management: {
    departments: `${ROOTS.MANAGEMENT}/departments`,
    locations: `${ROOTS.MANAGEMENT}/locations`,
    industries: `${ROOTS.MANAGEMENT}/industries`,
    skills: `${ROOTS.MANAGEMENT}/skills`,
  },
  administration: {
    users: `${ROOTS.ADMINISTRATION}/users`,
    orders: `${ROOTS.ADMINISTRATION}/orders`,
    roles: `${ROOTS.ADMINISTRATION}/roles`,
    permissions: `${ROOTS.ADMINISTRATION}/permissions`,
    createUser:`${ROOTS.ADMINISTRATION}/createuser`
  }
};
