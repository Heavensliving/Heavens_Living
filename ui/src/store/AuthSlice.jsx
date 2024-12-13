import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        admin: JSON.parse(localStorage.getItem('admin')) || null,
    },
    reducers: {
        setAdmin: (state, action) => {
            state.admin = action.payload;
            localStorage.setItem('admin', JSON.stringify(action.payload));
        },
        adminLogout: (state) => {
            state.admin = null;
            localStorage.removeItem('admin');
        },
    }
})

export const {setAdmin,adminLogout} = authSlice.actions

export default authSlice.reducer;