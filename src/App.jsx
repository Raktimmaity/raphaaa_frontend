import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div>
      <Toaster position="top-right"/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
          <Route index element={<Home/>} />
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="profile" element={<Profile/>}/>
            {/* User Layout */}
          </Route>
          <Route>{/* Admin Layout */}</Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
