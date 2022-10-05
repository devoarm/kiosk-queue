import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  apiUrl: "",
  token: "",
  printerId: "",
  status: false,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    getStorage: (state) => {
      state.apiUrl = localStorage.getItem("apiUrl");
    },
    onConnect: (state) =>{
      state.status = true
    }
  },
});

// Action creators are generated for each case reducer function
export const { getStorage } = counterSlice.actions;

export default counterSlice.reducer;
