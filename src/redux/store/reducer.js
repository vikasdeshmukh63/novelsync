// third-party
import { combineReducers } from 'redux';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import roleReducer from '../slices/roles';
import signUpReducer from '../slices/signUp';
import inviteReducer from '../slices/invites';
// project imports
import generalReducer from '../slices/general';
import companyReducer from '../slices/company';
import industryReducer from '../slices/industry';
import customerReducer from '../slices/customers';
import locationReducer from '../slices/locations';
import departmentReducer from '../slices/depatment';
import permissionsReducer from '../slices/permissions';
import proficiencyReducer from '../slices/proficiency';
import organizationReducer from '../slices/organization';

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
};

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  general: generalReducer,
  industries: industryReducer,
  customers: customerReducer,
  locations: locationReducer,
  departments: departmentReducer,
  roles: roleReducer,
  permissions: permissionsReducer,
  company: companyReducer,
  invites: inviteReducer,
  signUp: signUpReducer,
  organization: organizationReducer,
  proficiency: proficiencyReducer,
});

const initialState = reducer({}, {});

const rootReducer = (state, action) => {
  if (action.type === 'LOG_OUT') {
    state = initialState;
  }
  return reducer(state, action);
};
export { rootReducer, rootPersistConfig };
