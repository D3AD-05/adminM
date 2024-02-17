import { USER_DETAILS } from "./index";

export const setUserDetails = (userData) => (
  console.log(userData),
  {
    type: USER_DETAILS,
    payload: userData,
  }
);
