import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import AdminGuard from "./components/AdminGuard/AdminGuard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// Har bir sahifa alohida bo'lak (chunk) sifatida kerak bo'lganda yuklanadi
const Home = lazy(() => import("./pages/Home/Home"));
const Properties = lazy(() => import("./pages/Properties/Properties"));
const PropertyDetailPage = lazy(
  () => import("./pages/PropertyDetail/PropertyDetail")
);
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Favorites = lazy(() => import("./pages/Favorites/Favorites"));
const MyInquiries = lazy(() => import("./pages/MyInquiries/MyInquiries"));
const ReceivedInquiries = lazy(
  () => import("./pages/ReceivedInquiries/ReceivedInquiries")
);
const MyProperties = lazy(() => import("./pages/MyProperties"));
const CreateProperty = lazy(() => import("./pages/CreateProperty"));
const EditProperty = lazy(() => import("./pages/EditProperty"));

const AdminDashboard = lazy(
  () => import("./pages/Admin/AdminDashboard/AdminDashboard")
);
const AdminProperties = lazy(
  () => import("./pages/Admin/AdminProperties/AdminProperties")
);
const AdminCategories = lazy(
  () => import("./pages/Admin/AdminCategories/AdminCategories")
);
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers/AdminUsers"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { pathname } = useLocation();
  // Login/Register to'liq ekranli sahifalar: footer ko'rsatilmaydi
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1">
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Hamma uchun ochiq */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Faqat kirgan foydalanuvchilar uchun (kabinet: chapda sidebar) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/my-inquiries" element={<MyInquiries />} />
                <Route path="/received-inquiries" element={<ReceivedInquiries />} />
                <Route path="/my-properties" element={<MyProperties />} />
                <Route path="/create-property" element={<CreateProperty />} />
                <Route path="/edit-property/:id" element={<EditProperty />} />
              </Route>
              {/* Notion'dagi nomlar uchun yo'naltirish */}
              <Route
                path="/inquiries"
                element={<Navigate to="/my-inquiries" replace />}
              />
            </Route>

            {/* Faqat ADMIN uchun: xuddi shu kabinet maketi + admin bo'limi */}
            <Route element={<AdminGuard />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/properties" element={<AdminProperties />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
