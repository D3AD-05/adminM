// import { SET_USER_DETAILS } from "../constants/actionTypes";
import { actionType } from "../constants/actionTypes";
export const setUserDetails = (userdata) => {
  return {
    type: actionType.SET_USER_DETAILS,
    payload: userdata,
  };
};
