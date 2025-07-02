// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import axios from 'axios';

// // // Retrieve user info and token from localStorage if available
// // const userFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

// // // Check for an existing guest ID in the localstorage or generate a new one
// // const initialGuestId = localStorage.getItem('guestId') || `guest_${Date.now()}`;
// // localStorage.setItem('guestId', initialGuestId);

// // // Initial state
// // const initialState = {
// //     user: userFromStorage,
// //     guestId: initialGuestId,
// //     loading: false,
// //     error: null,
// // };

// // // Async thunk for user login
// // export const loginUser = createAsyncThunk("auth/loginUser", async (userData, {rejectWithValue}) => {
// //     try {
// //         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData);
// //         localStorage.setItem('userInfo', JSON.stringify(response.data.user));
// //         localStorage.setItem('userToken', response.data.token);
// //         return response.data.user; // Return the user object from the response
// //     } catch (error) {
// //         // console.error(error);
// //         return rejectWithValue(error.response.data);
// //     }
// // });

// // // Async thunk for user registration
// // export const registerUser = createAsyncThunk("auth/registerUser", async (userData, {rejectWithValue}) => {
// //     try {
// //         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData);
// //         localStorage.setItem('userInfo', JSON.stringify(response.data.user));
// //         localStorage.setItem('token', response.data.token);
// //         return response.data.user; // Return the user object from the response
// //     } catch (error) {
// //         // console.error(error);
// //         return rejectWithValue(error.response.data);
// //     }
// // });

// // // Slice
// // const authSlice = createSlice({
// //     name: "auth",
// //     initialState,
// //     reducers: {
// //         logout: (state) => {
// //             state.user = null;
// //             state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on logout
// //             localStorage.removeItem("userInfo");
// //             localStorage.removeItem("userToken");
// //             localStorage.setItem("guestId", state.guestId); // Set new guest ID in localStorage
// //         },
// //         generateNewGuestId: (state) => {
// //             state.guestId = `guest_${new Date().getTime()}`;
// //             localStorage.setItem("guestId", state.guestId); // Update guest ID in
// //         },
// //     },
// //     extraReducers: (builder) => {
// //         builder.addCase(loginUser.pending, (state) => {
// //             state.loading = true;
// //             state.error = null;
// //         })
// //         .addCase(loginUser.fulfilled, (state, action) => {
// //             state.loading = false;
// //             state.user = action.payload;
// //         })
// //         .addCase(loginUser.rejected, (state, action) => {
// //             state.loading = false;
// //             state.error = action.payload.message;
// //         })
// //         .addCase(registerUser.pending, (state) => {
// //             state.loading = true;
// //             state.error = null;
// //         })
// //         .addCase(registerUser.fulfilled, (state, action) => {
// //             state.loading = false;
// //             state.user = action.payload;
// //         })
// //         .addCase(registerUser.rejected, (state, action) => {
// //             state.loading = false;
// //             state.error = action.payload.message;
// //         })
// //     },
// // });

// // export const { logout, generateNewGuestId } = authSlice.actions;
// // export default authSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Retrieve user info and token from localStorage if available
// const userFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
// const tokenFromStorage = localStorage.getItem('token'); // Use consistent key

// // Check for an existing guest ID in the localstorage or generate a new one
// const initialGuestId = localStorage.getItem('guestId') || `guest_${Date.now()}`;
// localStorage.setItem('guestId', initialGuestId);

// // Initial state
// const initialState = {
//     user: userFromStorage,
//     token: tokenFromStorage,
//     guestId: initialGuestId,
//     loading: false,
//     error: null,
// };

// // Async thunk for user login
// export const loginUser = createAsyncThunk("auth/loginUser", async (userData, {rejectWithValue}) => {
//     try {
//         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData);
        
//         // Store with consistent keys
//         localStorage.setItem('userInfo', JSON.stringify(response.data.user));
//         localStorage.setItem('token', response.data.token); // Changed from 'userToken' to 'token'
        
//         return {
//             user: response.data.user,
//             token: response.data.token
//         };
//     } catch (error) {
//         console.error('Login error:', error);
//         return rejectWithValue(error.response?.data || { message: 'Login failed' });
//     }
// });

// // Async thunk for user registration
// export const registerUser = createAsyncThunk("auth/registerUser", async (userData, {rejectWithValue}) => {
//     try {
//         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData);
        
//         // Store with consistent keys
//         localStorage.setItem('userInfo', JSON.stringify(response.data.user));
//         localStorage.setItem('token', response.data.token);
        
//         return {
//             user: response.data.user,
//             token: response.data.token
//         };
//     } catch (error) {
//         console.error('Registration error:', error);
//         return rejectWithValue(error.response?.data || { message: 'Registration failed' });
//     }
// });

// // Slice
// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         logout: (state) => {
//             state.user = null;
//             state.token = null;
//             state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on logout
//             localStorage.removeItem("userInfo");
//             localStorage.removeItem("token"); // Use consistent key
//             localStorage.setItem("guestId", state.guestId); // Set new guest ID in localStorage
//         },
//         generateNewGuestId: (state) => {
//             state.guestId = `guest_${new Date().getTime()}`;
//             localStorage.setItem("guestId", state.guestId);
//         },
//         clearError: (state) => {
//             state.error = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder.addCase(loginUser.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(loginUser.fulfilled, (state, action) => {
//             state.loading = false;
//             state.user = action.payload.user;
//             state.token = action.payload.token;
//         })
//         .addCase(loginUser.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.payload?.message || 'Login failed';
//         })
//         .addCase(registerUser.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(registerUser.fulfilled, (state, action) => {
//             state.loading = false;
//             state.user = action.payload.user;
//             state.token = action.payload.token;
//         })
//         .addCase(registerUser.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.payload?.message || 'Registration failed';
//         })
//     },
// });

// export const { logout, generateNewGuestId, clearError } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosConfig'; // Import your configured axios

// Retrieve user info and token from localStorage if available
const userFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
const tokenFromStorage = localStorage.getItem('token');

// Check for an existing guest ID in the localstorage or generate a new one
const initialGuestId = localStorage.getItem('guestId') || `guest_${Date.now()}`;
localStorage.setItem('guestId', initialGuestId);

// Initial state
const initialState = {
    user: userFromStorage,
    token: tokenFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.post('/api/users/login', userData);
        
        // Store with consistent keys
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        return {
            user: response.data.user,
            token: response.data.token
        };
    } catch (error) {
        console.error('Login error:', error);
        return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
});

// Async thunk for user registration
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.post('/api/users/register', userData);
        
        // Store with consistent keys
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        return {
            user: response.data.user,
            token: response.data.token
        };
    } catch (error) {
        console.error('Registration error:', error);
        return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
});

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
            localStorage.setItem("guestId", state.guestId);
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Login failed';
        })
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Registration failed';
        })
    },
});

export const { logout, generateNewGuestId, clearError } = authSlice.actions;
export default authSlice.reducer;