import * as TYPES from 'App/Components/Redux/Types';

const TAG = "GENERAL ACTIONS";

/**
 * Counter Function
 * @param {Boolean} increment - Operation type, increment or not (decrement)
 */
export function counterStrike(increment = true) {
  return (dispatch, getState) => {
    return dispatch({
      type: TYPES.COUNTER,
      counter: (increment) ? getState().counter + 1 : getState().counter - 1
    });
  }
}

/**
 * App Refresher
 * Only toggling true false like lamp switch
 */
export function refreshApp() {
  return (dispatch, getState) => {
    return dispatch({
      type: TYPES.REFRESH_APP,
      refresh_app: getState().refresh_app === true ? false : true
    });
  }
}
