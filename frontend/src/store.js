// store.js
import { createStore, combineReducers } from "redux";
import userDataReducer from "./userRedux/userReducers";

const rootReducer = combineReducers({
  user: userDataReducer,
  // other reducers...
});

const store = createStore(rootReducer);

export default store;
