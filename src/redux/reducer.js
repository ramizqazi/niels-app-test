import { combineReducers } from 'redux';

import AuthReducer from '../auth/redux/reducer';

/* ============================================================================
  Combine ALl Reducers
============================================================================= */
const rootReducer = combineReducers({
  auth: AuthReducer,
});

export default rootReducer;
