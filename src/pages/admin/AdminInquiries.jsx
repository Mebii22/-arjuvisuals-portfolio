import { useEffect, useState } from "react";
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
              <th>Name</th>
              <th>Email</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((i) => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.email}</td>
                <td>{i.service}</td>
                <td>{i.eventDate || "—"}</td>
                <td>
                  <span className={`pill ${i.status === "new" ? "new" : "pub"}`}>{i.status}</span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button type="button" onClick={() => setOpen(i)}>
                      View
                    </button>
                    <button type="button" className="danger" onClick={() => setConfirm(i)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="empty-state">No customer inquiries received yet.</p>}
      </div>

      {open && (
        <div className="modal-back" onClick={() => setOpen(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="kicker">Inquiry</p>
            <h2 className="editorial" style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>
              {open.name}
            </h2>
            <p>
              {open.email}
              {open.phone ? ` · ${open.phone}` : ""}
            </p>
            <p style={{ margin: "0.5rem 0" }}>
              {open.service} · {open.location || "Location not given"} · {open.eventDate || "Date TBC"}
            </p>
            {open.budget ? <p>Budget: {open.budget}</p> : null}
            <p style={{ margin: "1rem 0", fontWeight: 300 }}>{open.message}</p>
            <div className="field">
              <label>Status</label>
              <select value={open.status} onChange={(e) => update(open.id, { status: e.target.value })}>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="responded">Responded</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="field" style={{ marginTop: "0.8rem" }}>
              <label>Internal notes</label>
              <textarea
                value={open.notes || ""}
                onChange={(e) => setOpen({ ...open, notes: e.target.value })}
                onBlur={() => update(open.id, { notes: open.notes })}
              />
            </div>
            <button className="btn btn-sand" type="button" style={{ marginTop: "1rem" }} onClick={() => setOpen(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <div className="modal-back" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="editorial" style={{ fontSize: "1.6rem" }}>
              Delete inquiry from {confirm.name}?
            </h2>
            <p style={{ color: "var(--muted)", margin: "0.8rem 0 1.2rem" }}>
              This will permanently remove the inquiry from the database.
            </p>
            <div className="admin-actions">
              <button
                type="button"
                className="danger"
                onClick={async () => {
                  await inquiryService.remove(confirm.id);
                  setConfirm(null);
                  toast.push("Inquiry removed.");
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
