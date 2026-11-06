import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlinePhoto,
  HiOutlineBriefcase,
  HiOutlineInbox,
  HiOutlineUser,
  HiOutlineCamera,
} from "react-icons/hi2";
import { inquiryService } from "../services/inquiryService";

const LINKS = [
  { to: "/admin/dashboard", label: "Overview", icon: HiOutlineSquares2X2 },
  { to: "/admin/projects", label: "Projects", icon: HiOutlinePhoto },
  { to: "/admin/photographs", label: "Photographs", icon: HiOutlineCamera },
  { to: "/admin/services", label: "Services", icon: HiOutlineBriefcase },
  { to: "/admin/inquiries", label: "Inquiries", icon: HiOutlineInbox },
  { to: "/admin/profile", label: "Profile", icon: HiOutlineUser },
];

export default function AdminSidebar({ open, onLogout }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchUnread = () => {
      inquiryService
        .list()
        .then((list) => {
          if (!active) return;
          const count = Array.isArray(list) ? list.filter((i) => !i.isRead).length : 0;
          setUnreadCount(count);
        })
        .catch(() => {});
    };

    fetchUnread();
    window.addEventListener("focus", fetchUnread);
    window.addEventListener("inquiriesUpdated", fetchUnread);

    return () => {
      active = false;
      window.removeEventListener("focus", fetchUnread);
      window.removeEventListener("inquiriesUpdated", fetchUnread);
    };
  }, []);

  return (
    <aside className={`admin-side ${open ? "open" : ""}`}>
      <div className="brand">ARJU VISUALS</div>
      <div className="hint">Arjun Murali · sole admin</div>
      <nav>
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
            <l.icon />
            <span style={{ flex: 1 }}>{l.label}</span>
            {l.to === "/admin/inquiries" && unreadCount > 0 && (
              <span className="sidebar-inquiry-badge" title={`${unreadCount} unread inquiries`}>
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <button className="logout" type="button" onClick={onLogout}>
        Log out
      </button>
    </aside>
  );
}
