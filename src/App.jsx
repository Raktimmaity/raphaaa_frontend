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
import About from "./components/Common/About";
import Contact from "./components/Common/Contact";
import PrivacyPolicy from "./components/Common/PrivacyPolicy";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubmitReview from "./pages/SubmitReview";
import SubmitReviewFromOrder from "./pages/SubmitReviewFromOrder";
import UpdateProfile from "./pages/UpdateProfile";
import ReviewForm from "./pages/ReviewForm";
import CreateTask from "./pages/CreateTask";
import ViewTasks from "./pages/ViewTasks";
import InventoryPage from "./pages/InventoryPage";
import SalesTrendsPage from "./pages/SalesTrendsPage";
import RevenueReport from "./pages/RevenueReport";
import RegisterDeliveryBoy from "./pages/RegisterDeliveryBoy";
import ViewContacts from "./pages/ViewContacts";
import HeroSettings from "./pages/HeroSettings";
import AdminContactSettings from "./pages/AdminContactSettings";
import ScrollToTop from "./components/Common/ScrollToTop";
import ForgotPassword from "./pages/ForgotPassword";
import AdminCollabSettings from "./pages/AdminCollabSettings";
import AdminCollabPreview from "./pages/AdminCollabPreview";
import EditCollab from "./pages/EditCollab";
import AdminAboutSettings from "./pages/AdminAboutSettings";
import PrivacyPolicySettings from "./pages/PrivacyPolicySettings";
import AddEditOffer from "./pages/AddEditOffer";
import AdminOffersList from "./pages/AdminOffersList";
import OffersShowcase from "./pages/OffersShowcase";
import VerifyMobile from "./pages/VerifyMobile";
import AutoLogout from "./components/Common/AutoLogout";
import ViewSubscribers from "./pages/ViewSubscribers";
// import AdminAboutSettings from "./pages/AdminAboutSettings";

const App = () => {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Toaster position="top-right" />
      <BrowserRouter>
        <AutoLogout />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/review" element={<ReviewForm />} />
            <Route path="/review/:productId" element={<ReviewForm />} />
            <Route
              path="/register-delivery"
              element={<RegisterDeliveryBoy />}
            />
            {/* <Route path="/review-order/:orderId" element={<SubmitReviewFromOrder />} /> */}

            {/* extra added */}
            <Route path="/exclusive-drop" element={<ExclusiveDrop />} />
            <Route path="/exclusive-drop/:slug" element={<DropDetail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/offers" element={<OffersShowcase />} />
            <Route path="/verify-mobile" element={<VerifyMobile />} />

            {/* User Layout */}
          </Route>

          {/* <Route path="/admin" element={<AdminLayout/>}/> */}
          {/* Admin Layout */}
          {/* <Route path="/admin" element={<AdminLayout/>}>
            <Route index element={<ProtectedRoute role="admin"> <AdminHomePage/> </ProtectedRoute>} />
            <Route path="users" element={<UserManagement/>}/>
            <Route path="products" element={<ProductManagement/>}/>
            <Route path="products/:id/edit" element={<EditProductPage/>}/>
            <Route path="orders" element={<OrderManagement/>}/>
            <Route path="add-product" element={<AddProduct/> }/>
            <Route path="update-profile" element={<UpdateProfile/> }/>
          </Route> */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <AdminHomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-task"
              element={
                <ProtectedRoute role={["merchantise"]}>
                  <CreateTask />
                </ProtectedRoute>
              }
            />
            <Route
              path="view-tasks"
              element={
                <ProtectedRoute role={["merchantise"]}>
                  <ViewTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="all-tasks"
              element={
                <ProtectedRoute role={["admin"]}>
                  <ViewTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="inventory"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="trend-analysis"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <SalesTrendsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="revenue"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <RevenueReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="products"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <ProductManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="collab-settings"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <AdminCollabSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="collabs"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <AdminCollabPreview />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-collab/:id"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <EditCollab />
                </ProtectedRoute>
              }
            />
            <Route
              path="products/:id/edit"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <EditProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute role={["admin", "merchantise", "delivery_boy"]}>
                  <OrderManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-product"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="create-offers"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <AddEditOffer />
                </ProtectedRoute>
              }
            />
            <Route
              path="offers"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <AdminOffersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-offer/:id"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <AddEditOffer />
                </ProtectedRoute>
              }
            />

            <Route
              path="contact-messages"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <ViewContacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="website-settings/hero"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <HeroSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="website-settings/about"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <AdminAboutSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="website-settings/privacy&policy"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <PrivacyPolicySettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="website-settings/contact"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <AdminContactSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="update-profile"
              element={
                <ProtectedRoute role={["admin", "merchantise", "delivery_boy"]}>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="subscribed-users"
              element={
                <ProtectedRoute role={["admin", "merchantise"]}>
                  <ViewSubscribers/>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
