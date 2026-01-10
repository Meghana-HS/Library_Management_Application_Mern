// src/components/NotificationsPanel.jsx
import React, { useEffect, useState } from "react";
import { request } from "../services/api"; // <-- your helper

function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setState({ loading: true, error: "" });
        const data = await request("/notifications"); // GET /api/notifications
        if (!cancelled) {
          setNotifications(data.notifications || []);
          setState({ loading: false, error: "" });
        }
      } catch (err) {
        console.error("load notifications error:", err);
        if (!cancelled) {
          setState({
            loading: false,
            error:
              err.message ||
              "Failed to load notifications. Please try again later.",
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const { loading, error } = state;

  const statusColor = (status) => {
    switch (status) {
      case "SENT":
        return "bg-green-100 text-green-800 border-green-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const typeColor = (type) => {
    switch (type) {
      case "LOW_STOCK":
        return "bg-purple-100 text-purple-800";
      case "DUE_REMINDER":
        return "bg-blue-100 text-blue-800";
      case "OVERDUE_FINE":
        return "bg-orange-100 text-orange-800";
      case "MEMBERSHIP_EXPIRY":
        return "bg-teal-100 text-teal-800";
      case "DAMAGE_REPORTED":
        return "bg-pink-100 text-pink-800";
      case "WELCOME":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Notifications
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            All email + system notifications for your LMS
          </p>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 shadow-inner">
          {notifications.length} items
        </span>
      </div>

      {loading && (
        <div className="py-6 text-sm text-gray-500">Loading...</div>
      )}

      {error && !loading && (
        <div className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !notifications.length && (
        <div className="py-6 text-sm text-gray-500">
          No notifications to display yet.
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n._id}
              className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5 hover:bg-gray-50 transition"
            >
              <div className="w-1 mt-0.5 rounded-full bg-gradient-to-b from-indigo-500 to-sky-500" />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${typeColor(
                      n.type
                    )}`}
                  >
                    {n.type.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 border ${statusColor(
                      n.status
                    )}`}
                  >
                    {n.status}
                  </span>
                  <span className="ml-auto text-[10px] text-gray-400">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-gray-900 truncate">
                  {n.subject || "(no subject)"}
                </p>

                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500 truncate max-w-xs">
                    {n.message || "No preview available."}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    • {n.email}
                  </span>
                </div>

                {n.error && (
                  <p className="mt-1 text-[11px] text-red-600 line-clamp-2">
                    {n.error}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPanel;
