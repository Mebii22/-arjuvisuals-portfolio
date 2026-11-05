import { useEffect, useState } from "react";
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineTrash, HiOutlineCheck } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa6";
import SEO from "../../components/SEO";
import { inquiryService } from "../../services/inquiryService";
import { useToast } from "../../context/ToastContext";

export default function AdminInquiries() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = () =>
    inquiryService
      .list()
      .then(setList)
      .catch((err) => toast.push(err.message || "Could not load inquiries.", "err"));

  useEffect(() => {
    load();
  }, []);

  const update = async (id, payload) => {
    try {
      await inquiryService.update(id, payload);
      toast.push("Inquiry updated.");
      load();
      if (open && (open.id === id || open._id === id)) {
        const next = await inquiryService.getById(id);
        setOpen(next);
      }
    } catch (err) {
      toast.push(err.message || "Could not update inquiry.", "err");
    }
  };

  const cleanPhoneDigits = (phone) => String(phone || "").replace(/\D/g, "");

  return (
    <>
      <SEO title="Inquiries" />
      <div className="admin-top">
        <h1>INQUIRIES</h1>
      </div>
      <div className="demo-banner">
        Live customer inquiries received through <strong>ArjuVisuals.co</strong>, stored securely in MongoDB Atlas.
      </div>

      <div className="admin-card" style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Timeline &amp; Location</th>
              <th>Status</th>
              <th>Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((i) => {
              const digits = cleanPhoneDigits(i.phone);
              const waUrl = digits
                ? `https://wa.me/${digits}?text=${encodeURIComponent(
                    `Hello ${i.name}, thank you for contacting ArjuVisuals regarding ${i.service}. We received your inquiry and would love to connect!`
                  )}`
                : null;
              const mailtoUrl = `mailto:${i.email}?subject=${encodeURIComponent(
                `ArjuVisuals — Inquiry regarding ${i.service}`
              )}&body=${encodeURIComponent(
                `Hi ${i.name},\n\nThank you for reaching out to ArjuVisuals regarding your inquiry for ${i.service}.\n\n`
              )}`;

              return (
                <tr key={i.id || i._id}>
                  <td>
                    <strong style={{ color: "var(--stone)", display: "block" }}>{i.name}</strong>
                    <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>{i.email}</span>
                    {i.phone && (
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)", display: "block" }}>
                        {i.phone}
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{i.service}</span>
                    {i.budget && (
                      <span style={{ fontSize: "0.72rem", color: "var(--sand)", display: "block" }}>
                        Budget: {i.budget}
                      </span>
                    )}
                  </td>
                  <td>
                    <span>{i.eventDate || "Date TBC"}</span>
                    {i.location && (
                      <span style={{ fontSize: "0.74rem", color: "var(--muted)", display: "block" }}>
                        {i.location}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`pill ${i.status === "new" ? "new" : "pub"}`}>{i.status}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", flexWrap: "wrap" }}>
                      {/* Email Reply */}
                      <a
                        href={mailtoUrl}
                        className="btn btn-outline"
                        title="Reply by Email"
                        style={{
                          padding: "0.3rem 0.55rem",
                          fontSize: "0.74rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          textDecoration: "none",
                          color: "var(--sand)",
                          borderColor: "var(--sand)",
                        }}
                      >
                        <HiOutlineEnvelope size={13} /> Email
                      </a>

                      {/* WhatsApp Reply */}
                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                          title="Reply on WhatsApp"
                          style={{
                            padding: "0.3rem 0.55rem",
                            fontSize: "0.74rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            textDecoration: "none",
                            color: "#25D366",
                            borderColor: "rgba(37, 211, 102, 0.4)",
                          }}
                        >
                          <FaWhatsapp size={13} /> WhatsApp
                        </a>
                      )}

                      {/* Phone Call */}
                      {i.phone && (
                        <a
                          href={`tel:${i.phone}`}
                          className="btn btn-outline"
                          title="Call Client"
                          style={{
                            padding: "0.3rem 0.55rem",
                            fontSize: "0.74rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            textDecoration: "none",
                            color: "var(--stone)",
                            borderColor: "var(--dark-border)",
                          }}
                        >
                          <HiOutlinePhone size={13} /> Call
                        </a>
                      )}

                      {/* Status Toggle Button */}
                      <button
                        type="button"
                        onClick={() =>
                          update(i.id || i._id, {
                            status: i.status === "new" ? "responded" : "new",
                          })
                        }
                        title={i.status === "new" ? "Mark as Responded / Contacted" : "Mark as New"}
                        style={{
                          padding: "0.3rem 0.55rem",
                          fontSize: "0.74rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <HiOutlineCheck size={13} />
                        {i.status === "new" ? "Contacted" : "New"}
                      </button>

                      {/* View Details Modal */}
                      <button
                        type="button"
                        onClick={() => setOpen(i)}
                        style={{ padding: "0.3rem 0.55rem", fontSize: "0.74rem" }}
                      >
                        Details
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="danger"
                        onClick={() => setConfirm(i)}
                        title="Delete Inquiry"
                        style={{
                          padding: "0.3rem 0.5rem",
                          fontSize: "0.74rem",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <HiOutlineTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!list.length && <p className="empty-state">No customer inquiries received yet.</p>}
      </div>

      {/* Inquiry Detail Modal */}
      {open && (
        <div className="modal-back" onClick={() => setOpen(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <p className="kicker">Inquiry Details</p>
            <h2 className="editorial" style={{ fontSize: "1.9rem", marginBottom: "0.4rem" }}>
              {open.name}
            </h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
              <span>✉ {open.email}</span>
              {open.phone && <span>📞 {open.phone}</span>}
            </div>

            {/* Direct 1-Click Action Bar inside modal */}
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                flexWrap: "wrap",
                background: "rgba(0,0,0,0.25)",
                padding: "0.8rem",
                borderRadius: 4,
                border: "1px solid var(--dark-border)",
                marginBottom: "1.2rem",
              }}
            >
              <a
                href={`mailto:${open.email}?subject=${encodeURIComponent(
                  `ArjuVisuals — Inquiry regarding ${open.service}`
                )}&body=${encodeURIComponent(
                  `Hi ${open.name},\n\nThank you for reaching out to ArjuVisuals regarding your inquiry for ${open.service}.\n\n`
                )}`}
                className="btn btn-sand"
                style={{
                  padding: "0.45rem 0.9rem",
                  fontSize: "0.78rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  textDecoration: "none",
                }}
              >
                <HiOutlineEnvelope size={15} /> Reply by Email
              </a>

              {cleanPhoneDigits(open.phone) && (
                <a
                  href={`https://wa.me/${cleanPhoneDigits(open.phone)}?text=${encodeURIComponent(
                    `Hello ${open.name}, thank you for contacting ArjuVisuals regarding ${open.service}. We received your inquiry and would love to connect!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{
                    padding: "0.45rem 0.9rem",
                    fontSize: "0.78rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    textDecoration: "none",
                    color: "#25D366",
                    borderColor: "rgba(37, 211, 102, 0.5)",
                  }}
                >
                  <FaWhatsapp size={15} /> WhatsApp Reply
                </a>
              )}

              {open.phone && (
                <a
                  href={`tel:${open.phone}`}
                  className="btn btn-outline"
                  style={{
                    padding: "0.45rem 0.9rem",
                    fontSize: "0.78rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    textDecoration: "none",
                    color: "var(--stone)",
                    borderColor: "var(--dark-border)",
                  }}
                >
                  <HiOutlinePhone size={15} /> Direct Call
                </a>
              )}
            </div>

            <table style={{ width: "100%", fontSize: "0.85rem", marginBottom: "1rem" }}>
              <tbody>
                <tr>
                  <td style={{ color: "var(--muted)", width: 120, padding: "0.3rem 0" }}>Service:</td>
                  <td style={{ fontWeight: 600 }}>{open.service}</td>
                </tr>
                <tr>
                  <td style={{ color: "var(--muted)", padding: "0.3rem 0" }}>Date / Timeline:</td>
                  <td>{open.eventDate || "Date TBC"}</td>
                </tr>
                <tr>
                  <td style={{ color: "var(--muted)", padding: "0.3rem 0" }}>Location:</td>
                  <td>{open.location || "Location not specified"}</td>
                </tr>
                {open.budget && (
                  <tr>
                    <td style={{ color: "var(--muted)", padding: "0.3rem 0" }}>Budget:</td>
                    <td style={{ color: "var(--sand)" }}>{open.budget}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ fontSize: "0.74rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Client Message
              </label>
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "0.9rem",
                  borderRadius: 4,
                  border: "1px solid var(--dark-border)",
                  marginTop: "0.4rem",
                  whiteSpace: "pre-line",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                {open.message}
              </div>
            </div>

            <div className="field">
              <label>Inquiry Status</label>
              <select
                value={open.status}
                onChange={(e) => update(open.id || open._id, { status: e.target.value })}
              >
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="responded">Responded / Contacted</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="field" style={{ marginTop: "0.8rem" }}>
              <label>Internal Studio Notes</label>
              <textarea
                rows={3}
                value={open.notes || ""}
                placeholder="Add private studio notes (client budget agreed, quote sent, etc.)..."
                onChange={(e) => setOpen({ ...open, notes: e.target.value })}
                onBlur={() => update(open.id || open._id, { notes: open.notes })}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.4rem" }}>
              <button
                type="button"
                className="btn btn-sand"
                onClick={() => setOpen(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => {
                  setConfirm(open);
                  setOpen(null);
                }}
                style={{ padding: "0.5rem 0.9rem", fontSize: "0.78rem" }}
              >
                Delete Inquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirm && (
        <div className="modal-back" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="editorial" style={{ fontSize: "1.6rem" }}>
              Delete inquiry from {confirm.name}?
            </h2>
            <p style={{ color: "var(--muted)", margin: "0.8rem 0 1.2rem" }}>
              This will permanently remove the inquiry from MongoDB Atlas.
            </p>
            <div className="admin-actions">
              <button
                type="button"
                className="danger"
                onClick={async () => {
                  await inquiryService.remove(confirm.id || confirm._id);
                  setConfirm(null);
                  toast.push("Inquiry removed from database.");
                  load();
                }}
              >
                Delete
              </button>
              <button type="button" onClick={() => setConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
