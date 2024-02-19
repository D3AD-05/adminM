import { actionType } from "../constants/actionTypes";
const initialState = {
  userDetails: [],
};

export const userReducer = (state = initialState, { type, payload }) => {
  console.log(payload);
  switch (type) {
    case actionType.SET_USER_DETAILS:
      return { ...state, userData: payload };

    default:
      return state;
  }
};
