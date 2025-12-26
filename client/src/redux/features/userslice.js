import { createSlice } from "@reduxjs/toolkit";
const initialState={
    user:{}
}
export const userSlice= createSlice({
    name:"user",
    initialState,
    reducers:{
        savedUser:(state,action)=>{
            state.user=action.payload
        },
        clearUser:(state)=>{
            state.user={}
        }
    }
})

export const{savedUser,clearUser}=userSlice.actions
export default  userSlice.reducer