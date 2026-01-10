// src/pages/admin/PendingApprovals.jsx
import React, { useEffect, useState } from "react";
import { request } from "../../services/api";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";
import { FaCheck, FaTimes, FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PendingApprovals() {
  const [pending, setPending] = useState([]);
  const [msg, setMsg] = useState("");

  const loadPending = async () => {
    try {
      const data = await request("/admin/pending"); // backend returns JSON array
      setPending(data);
      setMsg("");
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Error loading pending users");
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const approve = async id => {
    try {
      await request(`/admin/approve/${id}`, { method: "POST" });
      loadPending();
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Error approving user");
    }
  };

  const reject = async id => {
    try {
      await request(`/admin/reject/${id}`, { method: "DELETE" });
      loadPending();
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Error rejecting user");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative", // important so overlay doesn't cover sidebar
        backgroundImage:
          "url('https://images.unsplash.com/photo-1703969806576-752625d45adf?auto=format&fit=crop&w=800&q=60')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "50px",
        paddingBottom: "50px",
      }}
    >
      {/* Overlay only over this page content, not whole app */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />

      <Container style={{ position: "relative", zIndex: 2 }}>
        <h1
          className="text-center text-white mb-5"
          style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}
        >
          Pending Approvals
        </h1>

        {msg && <Alert variant="danger">{msg}</Alert>}

        {pending.length === 0 ? (
          <p className="text-white text-center">No pending users.</p>
        ) : (
          <Row className="g-4">
            {pending.map(user => (
              <Col md={6} lg={4} key={user._id}>
                <Card className="h-100 shadow-lg hover-effect rounded-4">
                  <Card.Body className="d-flex flex-column align-items-center text-center">
                    <FaUser size={60} className="mb-3" color="#0077cc" />
                    <Card.Title>{user.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {user.email}
                    </Card.Subtitle>
                    <Badge
                      bg={
                        user.role === "ADMIN"
                          ? "danger"
                          : user.role === "LIBRARIAN"
                          ? "primary"
                          : "success"
                      }
                      className="mb-2"
                    >
                      {user.role}
                    </Badge>

                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => approve(user._id)}
                      >
                        <FaCheck /> Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => reject(user._id)}
                      >
                        <FaTimes /> Reject
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
