import { configureStore } from "@reduxjs/toolkit";
import configSlice from "../slices/configSlice";

//Global store
export const store = configureStore({
  reducer: {
    //reducers are defined here
    config: configSlice,
  },
});