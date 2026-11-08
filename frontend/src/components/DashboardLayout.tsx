import { Outlet } from "react-router-dom";

/** Kabinet sahifalari uchun umumiy konteyner (yon panel yo'q: havolalar foydalanuvchi menyusida). */
function DashboardLayout() {
  return (
    <main className="container-page py-8 pb-20 lg:py-12">
      <Outlet />
    </main>
  );
}

export default DashboardLayout;
