import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // 👈 import the reducer
import productReducer from './slices/productsSlice'; // 👈 import the product reducer
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";
import adminProductReducer from "./slices/adminProductSlice";
import adminOrdersReducer from "./slices/adminOrderSlice";
import adminUsersReducer from "./slices/adminUserSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, // 👈 add it here
    products: productReducer, // 👈 add the product reducer here
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    admin: adminReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrdersReducer,
    adminUsers: adminUsersReducer
  },
});

export default store;
