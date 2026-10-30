import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!isAuthed) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-shell">
      <AdminSidebar
        open={open}
        onLogout={() => {
          logout();
          navigate("/admin/login");
        }}
      />
      <div className="admin-main" onClick={() => open && setOpen(false)}>
        <button className="admin-menu-btn" type="button" onClick={() => setOpen((v) => !v)}>
          Menu
        </button>
        <Outlet />
      </div>
    </div>
  );
}
