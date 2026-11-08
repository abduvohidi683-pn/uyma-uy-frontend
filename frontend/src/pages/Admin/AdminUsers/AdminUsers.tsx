
import Loading from "../../../components/Loading";
import { useEffect, useState } from "react";
import { getAdminUsers } from "../../../services/admin";
import type { AdminUser } from "../../../services/admin";
import "./AdminUsers.css";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";

function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAdminUsers();
                setUsers(data);
            } catch {
                setError("Foydalanuvchilarni yuklashda xatolik.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-container">
            <AdminSidebar active="users" />

            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1>Foydalanuvchilar</h1>
                        <p>Barcha ro‘yxatdan o‘tgan foydalanuvchilar</p>
                    </div>
                </header>

                <div className="admin-search">
                    <input
                        type="text"
                        placeholder="Ism yoki email bo‘yicha qidirish..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <Loading text="Yuklanmoqda..." />
                ) : error ? (
                    <p className="admin-error">{error}</p>
                ) : users.length === 0 ? (
                    <p>Hozircha foydalanuvchilar mavjud emas.</p>
                ) : filteredUsers.length === 0 ? (
                    <p>Qidiruv bo‘yicha foydalanuvchi topilmadi.</p>
                ) : (
                    <div className="admin-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ism</th>
                                    <th>Email</th>
                                    <th>Telefon</th>
                                    <th>Role</th>
                                    <th>E'lonlar</th>
                                    <th>Ro'yxatdan o'tgan</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || "—"}</td>
                                        <td>{user.role}</td>
                                        <td>{user._count?.properties ?? 0}</td>
                                        <td>
                                            {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminUsers;
