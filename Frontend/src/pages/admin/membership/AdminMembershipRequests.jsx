// src/pages/admin/membership/AdminMembershipRequests.jsx
import React, { useEffect, useState } from "react";
import { request } from "../../../services/api";
import {
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Container,
  Card,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";

export default function AdminMembershipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  async function load() {
    try {
      setLoading(true);
      const data = await request("/membership-requests");
      setRequests(data);
      setCurrentPage(1);
    } catch (e) {
      setMessage(e.message || "Failed to load membership requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpdate(id, status) {
    try {
      setMessage("");
      await request(`/membership-requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setMessage(
        status === "approved"
          ? "Membership approved and member created."
          : "Membership request rejected."
      );
      await load();
    } catch (e) {
      setMessage(e.message || "Failed to update membership request");
    }
  }

  // pagination calculations
  const totalPages = Math.ceil(requests.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRequests = requests.slice(startIndex, endIndex); // [web:44]

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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-3 px-md-4 py-3 border-top gap-2">
        <small className="text-muted" style={{ fontSize: "0.95rem" }}>
          Page {currentPage} of {totalPages} · Showing{" "}
          {requests.length === 0 ? 0 : startIndex + 1}–
          {Math.min(endIndex, requests.length)} of {requests.length}
        </small>
        <Pagination className="mb-0">
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e2ecff 0%, #f4f7ff 40%, #e0ebff 100%)",
        padding: "48px 0",
        fontSize: "1.08rem",
      }}
    >
      <Container style={{ maxWidth: "1400px" }}>
        <Row
          className="mb-4"
          style={{
            minHeight: "120px",
            alignItems: "center",
          }}
        >
          <Col>
            <h3
              className="mb-2"
              style={{ fontWeight: 700, color: "#1b3a57", fontSize: "2.1rem" }}
            >
              Membership requests
            </h3>
            <p
              className="text-muted mb-0"
              style={{ fontSize: "1.1rem", maxWidth: "700px" }}
            >
              Review, approve, or reject new membership applications.
            </p>
          </Col>
        </Row>

        {message && (
          <Alert
            variant={
              message.toLowerCase().includes("failed") ? "danger" : "success"
            }
            style={{ fontSize: "1.05rem" }}
          >
            {message}
          </Alert>
        )}

        <Card
          className="shadow-sm border-0"
          style={{
            borderRadius: "22px",
            overflow: "hidden",
            minHeight: "520px",
            width: "100%",
          }}
        >
          <Card.Body style={{ padding: "28px 28px 16px" }}>
            {loading ? (
              <div className="d-flex align-items-center py-5">
                <Spinner animation="border" className="me-3" />
                <span style={{ fontSize: "1.1rem" }}>Loading requests...</span>
              </div>
            ) : requests.length === 0 ? (
              <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
                No membership requests yet.
              </p>
            ) : (
              <>
                <div className="table-responsive">
                  <Table
                    hover
                    striped
                    className="mb-0 align-middle"
                    style={{ fontSize: "1.05rem" }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#f5f7fb",
                        borderBottom: "1px solid #e3e8f2",
                        fontSize: "1.02rem",
                      }}
                    >
                      <tr style={{ height: "60px" }}>
                        <th style={{ width: 80 }}>SL.NO</th>
                        <th>Student</th>
                        <th>Plan</th>
                        <th>Status</th>
                        <th>Requested at</th>
                        <th style={{ width: 260 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRequests.map((req, idx) => (
                        <tr key={req._id} style={{ height: "64px" }}>
                          <td>{startIndex + idx + 1}</td>
                          <td>
                            <strong>{req.user?.name}</strong>
                            <br />
                            <small
                              className="text-muted"
                              style={{ fontSize: "0.95rem" }}
                            >
                              {req.user?.email}
                            </small>
                          </td>
                          <td>{req.plan?.name}</td>
                          <td>
                            <Badge
                              bg={
                                req.status === "approved"
                                  ? "success"
                                  : req.status === "rejected"
                                  ? "danger"
                                  : "warning"
                              }
                              style={{
                                fontSize: "0.95rem",
                                padding: "0.45em 0.8em",
                              }}
                            >
                              {req.status}
                            </Badge>
                          </td>
                          <td>
                            <small style={{ fontSize: "0.98rem" }}>
                              {new Date(req.createdAt).toLocaleString()}
                            </small>
                          </td>
                          <td>
                            {req.status === "pending" ? (
                              <div className="d-flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="success"
                                  style={{
                                    fontSize: "0.98rem",
                                    padding: "0.35rem 1rem",
                                  }}
                                  onClick={() =>
                                    handleUpdate(req._id, "approved")
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  style={{
                                    fontSize: "0.98rem",
                                    padding: "0.35rem 1rem",
                                  }}
                                  onClick={() =>
                                    handleUpdate(req._id, "rejected")
                                  }
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span
                                className="text-muted"
                                style={{ fontSize: "0.98rem" }}
                              >
                                No actions
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
          </Card.Body>

          {!loading && requests.length > 0 && renderPagination()}
        </Card>
      </Container>
    </div>
  );
}
