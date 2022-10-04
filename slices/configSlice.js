import { createSlice } from '@reduxjs/toolkit'

const initialState = {  
  apiUrl: '',
  token: '',
  printerId:'',
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    getStorage: (state) => {      
      state.apiUrl = localStorage.getItem('apiUrl')
    },    
  },
})

// Action creators are generated for each case reducer function
export const { getStorage } = counterSlice.actions

export default counterSlice.reducer