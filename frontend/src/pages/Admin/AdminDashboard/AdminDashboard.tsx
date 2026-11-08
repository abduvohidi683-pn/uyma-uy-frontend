import Loading from "../../../components/Loading";
import { useEffect, useState } from "react";
import {
  getAdminProperties,
  getAdminUsers,
} from "../../../services/admin";
import "./AdminDashboard.css";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";

interface DashboardStats {
  totalProperties: number;
  pending: number;
  approved: number;
  rejected: number;
  users: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [pending, approved, rejected, users] =
          await Promise.all([
            getAdminProperties("PENDING", 1, 1),
            getAdminProperties("APPROVED", 1, 1),
            getAdminProperties("REJECTED", 1, 1),
            getAdminUsers(),
          ]);

        setStats({
          pending: pending.meta.total,
          approved: approved.meta.total,
          rejected: rejected.meta.total,
          totalProperties:
            pending.meta.total +
            approved.meta.total +
            rejected.meta.total,
          users: users.length,
        });
      } catch {
        setError("Statistikani yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loading text="Statistika yuklanmoqda..." />;
  }


  return (
    <div className="admin-container">
      <AdminSidebar active="dashboard" />

      <main className="dashboard-container">
        <h1>Admin Dashboard</h1>
        <p className="dashboard-subtitle">
          UyJoy platformasining umumiy statistikasi
        </p>

        {error && <p className="dashboard-error">{error}</p>}

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <span>Jami e'lonlar</span>
            <h2>{stats.totalProperties}</h2>
          </div>

          <div className="dashboard-card">
            <span>Kutilayotgan</span>
            <h2>{stats.pending}</h2>
          </div>

          <div className="dashboard-card">
            <span>Tasdiqlangan</span>
            <h2>{stats.approved}</h2>
          </div>

          <div className="dashboard-card">
            <span>Rad etilgan</span>
            <h2>{stats.rejected}</h2>
          </div>

          <div className="dashboard-card">
            <span>Foydalanuvchilar</span>
            <h2>{stats.users}</h2>
          </div>
        </div>
      </main>
    </div>
  );

}

export default AdminDashboard;