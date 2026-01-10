// src/pages/student/StudentDashboard.jsx
import React, { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import {
  FaSignOutAlt,
  FaSearch,
  FaBookOpen,
  FaUser,
  FaCheckCircle,
  FaMoneyBillAlt,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

import Report from "./Report";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutMsg, setLogoutMsg] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLogoutMsg(true);
    setTimeout(() => {
      setLogoutMsg(false);
      navigate("/login");
    }, 2000);
  };

  const isDashboardRoute =
    location.pathname === "/student" || location.pathname === "/student/";

  const isActive = (path) => location.pathname.startsWith(`/student/${path}`);

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
          width: 260,
          background: "#020617",
          color: "#e5e7eb",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          boxShadow: "8px 0 22px rgba(15,23,42,0.55)",
        }}
      >
        {/* Brand / top */}
        <div className="d-flex align-items-center mb-4">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background:
                "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
              boxShadow: "0 8px 18px rgba(79,70,229,0.8)",
            }}
          >
            <FaBookOpen size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#f9fafb" }}>
              Smart Library
            </div>
            <small style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
              Student panel
            </small>
          </div>
        </div>

        {/* Menu */}
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

          {/* NEW: Report / Dashboard item */}
          <Link to="report" style={{ textDecoration: "none" }}>
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("report") ? "active-menu" : ""
              }`}
            >
              <FaBookOpen size={18} className="me-3" />
              <span>My Dashboard</span>
            </div>
          </Link>

          <Link to="search" style={{ textDecoration: "none" }}>
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("search") ? "active-menu" : ""
              }`}
            >
              <FaSearch size={18} className="me-3" />
              <span>Search Books</span>
            </div>
          </Link>

          <Link to="recommendations" style={{ textDecoration: "none" }}>
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("recommendations") ? "active-menu" : ""
              }`}
            >
              <FaBookOpen size={18} className="me-3" />
              <span>Recommendations</span>
            </div>
          </Link>

          <Link to="requests" style={{ textDecoration: "none" }}>
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("requests") ? "active-menu" : ""
              }`}
            >
              <FaBookOpen size={18} className="me-3" />
              <span>My Requests</span>
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
            Account
          </div>

          <Link to="profile" style={{ textDecoration: "none" }}>
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("profile") ? "active-menu" : ""
              }`}
            >
              <FaUser size={18} className="me-3" />
              <span>Profile</span>
            </div>
          </Link>

          <Link to="membership" style={{ textDecoration: "none" }}>
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("membership") ? "active-menu" : ""
              }`}
            >
              <FaBookOpen size={18} className="me-3" />
              <span>Membership</span>
            </div>
          </Link>

          <Link to="fines" style={{ textDecoration: "none" }}>
            <div
              className={`p-3 rounded-3 d-flex align-items-center mb-2 menu-box ${
                isActive("fines") ? "active-menu" : ""
              }`}
            >
              <FaMoneyBillAlt size={18} className="me-3" />
              <span>My Fines</span>
            </div>
          </Link>
        </nav>

        {/* Logout button */}
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

      {/* Main content + nested pages */}
      <div
        style={{
          marginLeft: 260,
          flex: 1,
          padding: "24px 30px",
        }}
      >
        <Container fluid>
          {/* Top header bar */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2
                className="mb-1"
                style={{ fontWeight: 700, color: "#111827" }}
              >
                Student dashboard
              </h2>
              <p
                className="text-muted mb-0"
                style={{ fontSize: "0.94rem" }}
              >
                Track your books, requests, membership and smart suggestions.
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

          {/* Show report only on /student main dashboard */}
          {isDashboardRoute && (
            <div className="card shadow-sm p-4 rounded-4 border-0 mb-4">
              <Report />
            </div>
          )}

          {/* nested student routes render here */}
          <Outlet />
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
          border-color: #4f46e5;
          box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.7);
        }
        .active-menu span {
          color: #e5e7eb;
        }
      `}</style>
    </div>
  );
}
