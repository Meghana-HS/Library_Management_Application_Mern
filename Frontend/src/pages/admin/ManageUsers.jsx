// src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import { request } from "../../services/api";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Pagination,
} from "react-bootstrap";
import { FaCheck, FaTimes, FaUser, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // 5 users per page

  const loadUsers = async () => {
    try {
      const data = await request("/admin/users"); // backend returns JSON array
      setUsers(data);
      setMsg("");
      setCurrentPage(1); // reset pagination on reload
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Error loading users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const approve = async id => {
    try {
      await request(`/admin/approve/${id}`, { method: "POST" });
      loadUsers();
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Error approving user");
    }
  };

  const reject = async id => {
    try {
      await request(`/admin/reject/${id}`, { method: "DELETE" });
      loadUsers();
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Error rejecting user");
    }
  };

  const filteredUsers = users.filter(
    u =>
      (roleFilter === "ALL" || u.role === roleFilter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  // pagination over filtered users
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentUsers = filteredUsers.slice(startIndex, endIndex); // [web:99][web:25]

  const handlePageChange = page => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
        <small className="text-muted" style={{ fontSize: "0.9rem" }}>
          Page {currentPage} of {totalPages} · Showing{" "}
          {filteredUsers.length === 0 ? 0 : startIndex + 1}–
          {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}{" "}
          users
        </small>
        <Pagination size="sm" className="mb-0">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {items}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    );
  };

  const roleColors = {
    ADMIN: "#f28b82",
    LIBRARIAN: "#aecbfa",
    STUDENT: "#ccff90",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f7ff",
        padding: "40px 20px",
        color: "#000",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Container>
        <Button
          variant="primary"
          className="mb-3"
          style={{
            borderRadius: "8px",
            backgroundColor: "#1976d2",
            border: "none",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Go Back
        </Button>

        <h2 className="mb-4" style={{ fontWeight: "700", color: "#0a3d62" }}>
          Manage Users
        </h2>

        {msg && <Alert variant="danger">{msg}</Alert>}

        {/* Filters */}
        <Row className="mb-4 g-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset to first page on search change
              }}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #bcd4f6",
                borderRadius: "10px",
                padding: "12px",
                color: "#000",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            />
          </Col>

          <Col md={3}>
            <Form.Select
              value={roleFilter}
              onChange={e => {
                setRoleFilter(e.target.value);
                setCurrentPage(1); // reset to first page on filter change
              }}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #bcd4f6",
                borderRadius: "10px",
                padding: "12px",
                color: "#000",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="LIBRARIAN">Librarian</option>
              <option value="STUDENT">Student</option>
            </Form.Select>
          </Col>
        </Row>

        {/* User Cards */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {currentUsers.length > 0 ? (
            currentUsers.map(user => (
              <Col key={user._id}>
                <Card
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000",
                    borderRadius: "15px",
                    border: "1px solid #e3ecfa",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "0.3s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 18px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.08)";
                  }}
                >
                  <Card.Body>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <FaUser size={32} color="#1976d2" />
                      <div>
                        <Card.Title style={{ fontWeight: "600" }}>
                          {user.name}
                        </Card.Title>
                        <Card.Subtitle
                          style={{ color: "#6c6c6c", fontSize: "0.9rem" }}
                        >
                          {user.email}
                        </Card.Subtitle>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "14px",
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: roleColors[user.role] || "#bbdefb",
                          padding: "6px 10px",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          color: "#0d47a1",
                        }}
                      >
                        {user.role}
                      </span>

                      <span
                        style={{
                          backgroundColor: user.isApproved
                            ? "#c8e6c9"
                            : "#ffe0b2",
                          padding: "6px 10px",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          color: user.isApproved ? "#256029" : "#a65d00",
                        }}
                      >
                        {user.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>

                    {!user.isApproved && (
                      <div
                        style={{
                          marginTop: "16px",
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => approve(user._id)}
                        >
                          <FaCheck /> Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => reject(user._id)}
                        >
                          <FaTimes /> Reject
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p style={{ marginTop: "20px", color: "#333" }}>No users found.</p>
          )}
        </Row>

        {/* Pagination */}
        {filteredUsers.length > 0 && renderPagination()}
      </Container>
    </div>
  );
}
