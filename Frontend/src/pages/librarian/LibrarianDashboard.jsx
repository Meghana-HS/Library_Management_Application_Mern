// pages/librarian/LibrarianDashboard.jsx
import React, { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import {
  FaBook,
  FaTasks,
  FaClipboardList,
  FaUndo,
  FaSignOutAlt,
  FaCheckCircle,
  FaHome,
} from "react-icons/fa";
import ReportStats from "../admin/ReportStats";

export default function LibrarianDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutMsg, setLogoutMsg] = useState(false);
  const SIDEBAR_WIDTH = 260;

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    setLogoutMsg(true);
    setTimeout(() => navigate("/login"), 2000);
  };

  const isDashboardRoute =
    location.pathname === "/librarian" ||
    location.pathname === "/librarian/dashboard";

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #e0f2fe 0, transparent 45%), radial-gradient(circle at bottom right, #fee2e2 0, transparent 40%), #f3f4f6",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: SIDEBAR_WIDTH,
          background: "#020617",
          color: "#e5e7eb",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          boxShadow: "8px 0 22px rgba(15,23,42,0.6)",
        }}
      >
        {/* Brand */}
        <div className="d-flex align-items-center mb-4">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background:
                "linear-gradient(135deg, #22c55e 0%, #0ea5e9 40%, #6366f1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
              boxShadow: "0 8px 18px rgba(34,197,94,0.7)",
            }}
          >
            <FaHome size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#f9fafb" }}>
              Librarian Panel
            </div>
            <small style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
              Library operations
            </small>
          </div>
        </div>

        <nav style={{ fontSize: "0.9rem", marginBottom: 16 }}>
          <div
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.7rem",
              color: "#6b7280",
              marginBottom: 10,
              marginLeft: 4,
            }}
          >
            Overview
          </div>

          <Link to="/librarian" className="text-decoration-none">
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("/librarian") ? "active-menu" : ""
              }`}
            >
              <FaHome size={18} className="me-3" />
              <span>Dashboard</span>
            </div>
          </Link>

          <div
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.7rem",
              color: "#6b7280",
              margin: "12px 0 10px 4px",
            }}
          >
            Books
          </div>

          <Link to="/librarian/add-book" className="text-decoration-none">
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("/librarian/add-book") ? "active-menu" : ""
              }`}
            >
              <FaBook size={18} className="me-3" />
              <span>Add Book</span>
            </div>
          </Link>

          <Link
            to="/librarian/manage-books"
            className="text-decoration-none"
          >
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("/librarian/manage-books") ? "active-menu" : ""
              }`}
            >
              <FaTasks size={18} className="me-3" />
              <span>Manage Books</span>
            </div>
          </Link>

          <div
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.7rem",
              color: "#6b7280",
              margin: "12px 0 10px 4px",
            }}
          >
            Circulation
          </div>

          <Link to="/librarian/issue" className="text-decoration-none">
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("/librarian/issue") ? "active-menu" : ""
              }`}
            >
              <FaClipboardList size={18} className="me-3" />
              <span>Issue Book</span>
            </div>
          </Link>

          <Link to="/librarian/return" className="text-decoration-none">
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("/librarian/return") ? "active-menu" : ""
              }`}
            >
              <FaUndo size={18} className="me-3" />
              <span>Return Book</span>
            </div>
          </Link>

          <Link to="/librarian/requests" className="text-decoration-none">
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("/librarian/requests") ? "active-menu" : ""
              }`}
            >
              <FaClipboardList size={18} className="me-3" />
              <span>Book Requests</span>
            </div>
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="btn mt-auto"
          style={{
            background:
              "linear-gradient(135deg, #f97316 0%, #ef4444 45%, #b91c1c 100%)",
            border: "none",
            width: "100%",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "10px",
            fontWeight: "bold",
            borderRadius: 999,
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main content */}
      <div
        style={{
          marginLeft: SIDEBAR_WIDTH,
          flex: 1,
          padding: "24px 30px",
        }}
      >
        <Container fluid>
          {/* Top header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2
                className="mb-1"
                style={{ fontWeight: 700, color: "#111827" }}
              >
                Librarian dashboard
              </h2>
              <p
                className="text-muted mb-0"
                style={{ fontSize: "0.94rem" }}
              >
                Manage books, issues, returns, and student requests.
              </p>
            </div>
          </div>

          {logoutMsg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                backgroundColor: "#e6f4ea",
                color: "#056608",
                fontWeight: "bold",
                padding: "12px 20px",
                borderRadius: "10px",
                marginBottom: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              <FaCheckCircle /> Logout successfully!
            </div>
          )}

          {isDashboardRoute ? (
            <div className="card shadow-sm p-4 rounded-4 border-0">
              <ReportStats />
            </div>
          ) : (
            <Outlet />
          )}
        </Container>
      </div>

      <style>{`
        .menu-box {
          background: #020617;
          color: #e5e7eb;
          cursor: pointer;
          border: 1px solid transparent;
          transition: 0.2s ease;
        }
        .menu-box:hover {
          background: #111827;
          transform: translateX(4px);
          border-color: rgba(148, 163, 184, 0.5);
        }
        .active-menu {
          background: #111827;
          border-color: #22c55e;
          box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.7);
        }
        .active-menu span {
          color: #e5e7eb;
        }
      `}</style>
    </div>
  );
}
