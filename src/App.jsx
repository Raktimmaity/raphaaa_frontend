import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";

const App = () => {
  return (
    <div>
      <Toaster position="top-right"/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
          <Route index element={<Home/>} />
            {/* User Layout */}
          </Route>
          <Route>{/* Admin Layout */}</Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
