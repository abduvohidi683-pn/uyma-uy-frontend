import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import AdminGuard from "./components/AdminGuard/AdminGuard";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home/Home";
import Properties from "./pages/Properties/Properties";
import PropertyDetailPage from "./pages/PropertyDetail/PropertyDetail";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Profile from "./pages/Profile/Profile";
import Favorites from "./pages/Favorites/Favorites";
import MyInquiries from "./pages/MyInquiries/MyInquiries";
import MyProperties from "./pages/MyProperties";
import CreateProperty from "./pages/CreateProperty";
import EditProperty from "./pages/EditProperty";

import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminProperties from "./pages/Admin/AdminProperties/AdminProperties";
import AdminUsers from "./pages/Admin/AdminUsers/AdminUsers";
import NotFound from "./pages/NotFound";
import AdminCategories from "./pages/Admin/AdminCategories/AdminCategories";

function App() {
  const { pathname } = useLocation();
  const isAdminArea = pathname.startsWith("/admin");

  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        {/* Hamma uchun ochiq */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Faqat kirgan foydalanuvchilar uchun */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/my-inquiries" element={<MyInquiries />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/create-property" element={<CreateProperty />} />
          <Route path="/edit-property/:id" element={<EditProperty />} />
        </Route>

        {/* Faqat ADMIN uchun */}
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/properties" element={<AdminProperties />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminArea && <Footer />}
    </div>
  );
}

export default App;
