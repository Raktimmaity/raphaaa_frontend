import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ExclusiveDrop from "./pages/ExclusiveDrop";
import DropDetail from "./pages/DropDetail";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrders from "./pages/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";

import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import AddProduct from "./components/Admin/AddProduct";

const App = () => {
  return (
    <Provider store={store}>
      <Toaster position="top-right"/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
          <Route index element={<Home/>} />
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="collections/:collection" element={<CollectionPage/>}/>
          <Route path="product/:id" element={<ProductDetails/>}/>
          <Route path="checkout" element={<Checkout/>}/>
          <Route path="order-confirmation" element={<OrderConfirmationPage/>}/>
          <Route path="order/:id" element={<OrderDetailsPage/>}/>
          <Route path="/my-orders" element={<MyOrders/>}/>
          

          {/* extra added */}
          <Route path="/exclusive-drop" element={<ExclusiveDrop />} />
          <Route path="/exclusive-drop/:slug" element={<DropDetail />} />

          {/* User Layout */}
          </Route>

          {/* <Route path="/admin" element={<AdminLayout/>}/> */}
          <Route path="/admin" element={<AdminLayout/>}>{/* Admin Layout */}
            <Route index element={<ProtectedRoute role="admin"> <AdminHomePage/> </ProtectedRoute>} />
            <Route path="users" element={<UserManagement/>}/>
            <Route path="products" element={<ProductManagement/>}/>
            <Route path="products/:id/edit" element={<EditProductPage/>}/>
            <Route path="orders" element={<OrderManagement/>}/>
            <Route path="add-product" element={<AddProduct/> }/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
