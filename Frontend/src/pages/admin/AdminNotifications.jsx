import React, { useEffect, useState } from "react";
import { Badge, Spinner } from "react-bootstrap";
import { request } from "../../services/api";

const statusVariant = (status) => {
  switch (status) {
    case "SENT":
      return "success";
    case "FAILED":
      return "danger";
    case "PENDING":
      return "warning";
    default:
      return "secondary";
  }
};

const typeColor = (type) => {
  switch (type) {
    case "LOW_STOCK":
      return "#7c3aed";
    case "DUE_REMINDER":
      return "#2563eb";
    case "OVERDUE_FINE":
      return "#ea580c";
    case "MEMBERSHIP_EXPIRY":
      return "#059669";
    case "DAMAGE_REPORTED":
      return "#db2777";
    case "WELCOME":
      return "#22c55e";
    default:
      return "#4b5563";
  }
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await request("/notifications");
        if (!cancelled) {
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("load notifications error:", err);
        if (!cancelled) {
          setError(
            err.message || "Failed to load notifications. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center mb-3"
        style={{ gap: "10px" }}
      >
        <div>
          <h3
            className="mb-1"
            style={{ fontWeight: 600, color: "#111827", fontSize: "1.55rem" }}
          >
            Notifications
          </h3>
          <small style={{ color: "#6b7280" }}>
            Email + system notifications for your Library Management System.
          </small>
        </div>
        <Badge bg="light" text="dark" className="px-3 py-2 shadow-sm">
          {notifications.length} items
        </Badge>
      </div>

      {loading && (
        <div className="d-flex align-items-center gap-2 py-4">
          <Spinner animation="border" size="sm" />
          <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>
            Loading notifications…
          </span>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger py-2" style={{ fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      {!loading && !error && !notifications.length && (
        <div
          className="border rounded-3 py-4 px-3 text-center"
          style={{
            borderStyle: "dashed",
            borderColor: "#d1d5db",
            background:
              "radial-gradient(circle at top, #e5e7eb 0, #f9fafb 55%)",
          }}
        >
          <p className="mb-0" style={{ color: "#6b7280", fontSize: "0.95rem" }}>
            No notifications to display yet.
          </p>
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div
          className="p-3 rounded-4 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f3f4f6 45%, #ffffff 100%)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            className="table-responsive"
            style={{ maxHeight: "420px", overflowY: "auto" }}
          >
            <table className="table align-middle mb-0">
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#f3f4f6",
                }}
              >
                <tr style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  <th scope="col">Type</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Recipient</th>
                  <th scope="col">Status</th>
                  <th scope="col" style={{ width: "32%" }}>
                    Error / Info
                  </th>
                  <th scope="col">Created at</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.9rem" }}>
                {notifications.map((n) => (
                  <tr key={n._id}>
                    <td>
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: `${typeColor(n.type)}20`,
                          color: typeColor(n.type),
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        {n.type?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      <div
                        className="fw-semibold text-truncate"
                        style={{ maxWidth: 220 }}
                      >
                        {n.subject || "(no subject)"}
                      </div>
                      <div
                        className="text-muted text-truncate"
                        style={{ maxWidth: 260, fontSize: "0.8rem" }}
                      >
                        {n.message || "No preview available."}
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge bg-light text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {n.email}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge bg-${statusVariant(n.status)}`}
                        style={{ fontSize: "0.75rem" }}
                      >
                        {n.status}
                      </span>
                    </td>
                    <td>
                      {n.error ? (
                        <span
                          className="text-danger text-truncate d-inline-block"
                          style={{ maxWidth: 260, fontSize: "0.8rem" }}
                          title={n.error}
                        >
                          {n.error}
                        </span>
                      ) : (
                        <span
                          className="text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
                      >
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleString()
                          : ""}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
