// src/pages/admin/AdminDashboard.jsx
import React, { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { Container, Toast, ToastContainer } from "react-bootstrap";
import {
  FaUsers,
  FaUserCheck,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaList,
  FaMoneyBillWave,
  FaBell,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import ReportStats from "../admin/ReportStats";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowToast(true);
    setTimeout(() => navigate("/login"), 1500);
  };

  const isDashboardRoute =
    location.pathname === "/admin" || location.pathname === "/admin/reports";

  const menuItems = [
    { title: "Dashboard", icon: <FaChartBar />, link: "/admin" },
    { title: "Pending Approvals", icon: <FaUserCheck />, link: "/admin/pending" },
    { title: "Manage Users", icon: <FaUsers />, link: "/admin/users" },
    { title: "Members List", icon: <FaList />, link: "/admin/memberships/list" },
    {
      title: "Membership Requests",
      icon: <FaList />,
      link: "/admin/membership-requests",
    },
    { title: "Fines", icon: <FaMoneyBillWave />, link: "/admin/fines" },
    { title: "Email Jobs", icon: <FaList />, link: "/admin/email-jobs" },
    { title: "Notifications", icon: <FaBell />, link: "/admin/notifications" },
  ];

  const sidebarWidthOpen = 260;
  const sidebarWidthClosed = 84;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #dbeafe 0, transparent 45%), radial-gradient(circle at bottom right, #fee2e2 0, transparent 45%), #f3f4f6",
        fontSize: "1.02rem",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: isOpen ? sidebarWidthOpen : sidebarWidthClosed,
          transition: "width 0.25s ease",
          background: "linear-gradient(180deg, #020617 0%, #020617 60%, #020617 100%)",
          color: "#e5e7eb",
          display: "flex",
          flexDirection: "column",
          boxShadow: "10px 0 30px rgba(15,23,42,0.9)",
          position: "relative",
          zIndex: 10,
          borderRight: "1px solid #111827",
        }}
      >
        {/* Brand / toggle row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 14px 10px",
            borderBottom: "1px solid #1f2937",
            flexShrink: 0,
          }}
        >
          <button
            className="btn btn-sm d-flex align-items-center justify-content-center"
            onClick={() => setIsOpen(!isOpen)}
            style={{
              borderRadius: "999px",
              border: "1px solid #4b5563",
              backgroundColor: "#020617",
              width: 32,
              height: 32,
              padding: 0,
            }}
          >
            <FaBars size={15} color="#e5e7eb" />
          </button>
          {isOpen && (
            <div>
              <div
                style={{
                  fontWeight: 750,
                  fontSize: "1.06rem",
                  color: "#f9fafb",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                LMS Admin
              </div>
              <small
                style={{
                  fontSize: "0.78rem",
                  color: "#9ca3af",
                }}
              >
                Control center
              </small>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav
          style={{
            flex: 1,
            padding: "12px 10px 8px",
            overflowY: "auto",
          }}
        >
          <ul className="list-unstyled mb-0">
            {menuItems.map((item) => {
              const active =
                location.pathname === item.link ||
                (item.link !== "/admin" &&
                  location.pathname.startsWith(item.link));

              return (
                <li key={item.link} className="mb-1">
                  <Link
                    to={item.link}
                    className="text-decoration-none d-flex align-items-center"
                    style={{
                      gap: "10px",
                      padding: "9px 11px",
                      borderRadius: "12px",
                      color: active ? "#f9fafb" : "#d1d5db",
                      background: active
                        ? "linear-gradient(90deg, rgba(37,99,235,0.95), rgba(59,130,246,0.9))"
                        : "rgba(15,23,42,0.5)",
                      fontWeight: active ? 600 : 500,
                      fontSize: "0.96rem",
                      position: "relative",
                      overflow: "hidden",
                      border: active ? "1px solid rgba(250,204,21,0.8)" : "1px solid transparent",
                      boxShadow: active
                        ? "0 0 0 1px rgba(59,130,246,0.6)"
                        : "none",
                      transition:
                        "background 0.18s ease, transform 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, border 0.18s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "#111827";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "rgba(15,23,42,0.5)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }
                    }}
                  >
                    {active && (
                      <span
                        style={{
                          position: "absolute",
                          left: 6,
                          top: 7,
                          bottom: 7,
                          width: 3,
                          borderRadius: "999px",
                          backgroundColor: "#facc15",
                        }}
                      />
                    )}

                    <span
                      style={{
                        fontSize: "1.1rem",
                        minWidth: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </span>
                    {isOpen && <span>{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div
          style={{
            padding: "10px 12px 18px",
            borderTop: "1px solid #1f2937",
            flexShrink: 0,
            marginBottom: "10px",
          }}
        >
          <button
            onClick={handleLogout}
            className="btn d-flex align-items-center justify-content-center gap-2 w-100"
            style={{
              background:
                "linear-gradient(135deg, #f97316 0%, #ef4444 45%, #b91c1c 100%)",
              border: "none",
              color: "#f9fafb",
              padding: "8px 0",
              fontWeight: 600,
              borderRadius: "999px",
              fontSize: "0.95rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
              transition:
                "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 12px 26px rgba(0,0,0,0.75)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.6)";
            }}
          >
            <FaSignOutAlt size={16} />
            {isOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "24px 30px",
          fontSize: "1.04rem",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Container fluid>
          {/* Top header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2
                className="mb-1"
                style={{
                  fontWeight: 750,
                  color: "#111827",
                  fontSize: "1.85rem",
                }}
              >
                Admin dashboard
              </h2>
              <p
                className="text-muted mb-0"
                style={{ fontSize: "0.95rem" }}
              >
                Overview of users, memberships, fines, and system notifications.
              </p>
            </div>
          </div>

          {/* Dashboard wrapper card for nicer look */}
          {isDashboardRoute ? (
            <div
              style={{
                borderRadius: "18px",
                padding: "22px 22px 18px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(249,250,251,0.96))",
                boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
                border: "1px solid rgba(209,213,219,0.8)",
              }}
            >
              <ReportStats />
            </div>
          ) : (
            <div
              style={{
                borderRadius: "18px",
                padding: "18px 20px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(249,250,251,0.98))",
                boxShadow: "0 16px 40px rgba(15,23,42,0.16)",
                border: "1px solid rgba(209,213,219,0.85)",
                minHeight: "60vh",
              }}
            >
              <Outlet />
            </div>
          )}
        </Container>
      </main>

      {/* Logout Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          bg="success"
          delay={1500}
          autohide
        >
          <Toast.Body style={{ color: "#fff", fontWeight: "bold" }}>
            Logout Successful!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
