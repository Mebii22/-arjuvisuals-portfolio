import { NavLink } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlinePhoto,
  HiOutlineBriefcase,
  HiOutlineInbox,
  HiOutlineUser,
  HiOutlineCamera,
} from "react-icons/hi2";

const LINKS = [
  { to: "/admin/dashboard", label: "Overview", icon: HiOutlineSquares2X2 },
  { to: "/admin/projects", label: "Projects", icon: HiOutlinePhoto },
  { to: "/admin/photographs", label: "Photographs", icon: HiOutlineCamera },
  { to: "/admin/services", label: "Services", icon: HiOutlineBriefcase },
  { to: "/admin/inquiries", label: "Inquiries", icon: HiOutlineInbox },
  { to: "/admin/profile", label: "Profile", icon: HiOutlineUser },
];

export default function AdminSidebar({ open, onLogout }) {
  return (
    <aside className={`admin-side ${open ? "open" : ""}`}>
      <div className="brand">ARJU VISUALS</div>
      <div className="hint">Arjun Murali · sole admin</div>
      <nav>
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
            <l.icon /> {l.label}
          </NavLink>
        ))}
      </nav>
      <button className="logout" type="button" onClick={onLogout}>
        Log out
      </button>
    </aside>
  );
}
