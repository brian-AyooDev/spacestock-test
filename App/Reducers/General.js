import createReducer from 'App/Components/Redux/CreateReducer';
import * as TYPES from 'App/Components/Redux/Types';

/**
 * Counter Reducer
 */
export const counter = createReducer(0, {
  [TYPES.COUNTER](state, action) {
    return action.counter;
  }
});

/**
 * App Refresher
 */
export const refresh_app = createReducer(true, {
  [TYPES.REFRESH_APP](state, action) {
    return action.refresh_app;
  }
});
