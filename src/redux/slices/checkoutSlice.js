// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Async thunk to create a checkout session
// export const createCheckout = createAsyncThunk(
//   "checkout/createCheckout",
//   async (checkoutData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
//         checkoutData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem(userToken)}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// const checkoutSlice = createSlice({
//     name: "checkout",
//     initialState: {
//         checkout: null,
//         loading: false,
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//         .addCase(createCheckout.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(createCheckout.fulfilled, (state, action) => {
//             state.loading = false;
//             state.checkout = action.payload;
//         })
//         .addCase(createCheckout.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.payload.message;
//         })
//     }
// })

// export default checkoutSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to directly create order for Cash on Delivery
export const createCODOrder = createAsyncThunk(
  "checkout/createCODOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/cod`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update payment status
export const updatePaymentStatus = createAsyncThunk(
  "checkout/updatePaymentStatus",
  async ({ checkoutId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to finalize checkout
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        order: null,
        loading: false,
        error: null,
        paymentStatus: null,
    },
    reducers: {
        clearCheckout: (state) => {
            state.checkout = null;
            state.order = null;
            state.error = null;
            state.paymentStatus = null;
        },
        resetError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        // Create checkout
        .addCase(createCheckout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createCheckout.fulfilled, (state, action) => {
            state.loading = false;
            state.checkout = action.payload;
        })
        .addCase(createCheckout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to create checkout";
        })
        // Create COD Order
        .addCase(createCODOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createCODOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
            state.paymentStatus = 'cod_confirmed';
        })
        .addCase(createCODOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to create COD order";
        })
        // Update payment status
        .addCase(updatePaymentStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePaymentStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.checkout = action.payload;
            state.paymentStatus = 'payment_updated';
        })
        .addCase(updatePaymentStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to update payment";
        })
        // Finalize checkout
        .addCase(finalizeCheckout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(finalizeCheckout.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
            state.paymentStatus = 'finalized';
        })
        .addCase(finalizeCheckout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to finalize checkout";
        })
    }
})

export const { clearCheckout, resetError } = checkoutSlice.actions;
export default checkoutSlice.reducer;