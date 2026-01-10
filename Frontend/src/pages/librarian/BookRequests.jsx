// ...imports stay the same
import React, { useEffect, useState } from "react";
import { request } from "../../services/api";
import {
  Container,
  Table,
  Spinner,
  Badge,
  Button,
  Card,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";

export default function BookRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await request("/requests");
      setRequests(data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error loading requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await request(`/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadRequests();
    } catch (err) {
      console.error("Error updating status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const total = requests.length;
  const approved = requests.filter(r => r.status === "approved").length;
  const rejected = requests.filter(r => r.status === "rejected").length;
  const pending = requests.filter(r => r.status === "pending").length;

  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRequests = requests.slice(startIndex, endIndex);

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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-4 px-md-5 py-3 border-top gap-2 bg-white">
        <small className="text-muted" style={{ fontSize: "0.9rem" }}>
          Page {currentPage} of {totalPages} · Showing{" "}
          {total === 0 ? 0 : startIndex + 1}–
          {Math.min(endIndex, total)} of {total}
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

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "40px 0",
      }}
    >
      <Container fluid className="px-4 px-md-5 px-lg-6">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1" style={{ fontWeight: 700, color: "#111827" }}>
              Book requests
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
              Review and approve or reject student book requests.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <Row className="mb-4 g-3">
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="py-3 px-3">
                <small className="text-muted d-block mb-1">Total</small>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {total}
                </span>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="py-3 px-3">
                <small className="text-muted d-block mb-1">Pending</small>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {pending}
                </span>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="py-3 px-3">
                <small className="text-muted d-block mb-1">Approved</small>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {approved}
                </span>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="py-3 px-3">
                <small className="text-muted d-block mb-1">Rejected</small>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {rejected}
                </span>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main card + table */}
        <Card
          className="shadow-sm border-0"
          style={{ borderRadius: 18, overflow: "hidden" }}
        >
          <Card.Body style={{ padding: "26px 32px 16px" }}>
            {total === 0 ? (
              <div className="py-4 text-center text-muted">
                No requests yet.
              </div>
            ) : (
              <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  className="mb-0"
                  style={{ fontSize: "1rem" }}
                >
                  <thead
                    style={{
                      backgroundColor: "#f5f7fb",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <tr>
                      <th style={{ padding: "14px 18px", width: 70 }}>#</th>
                      {/* wider Student + Book columns */}
                      <th style={{ padding: "14px 26px", width: 260 }}>
                        Student
                      </th>
                      <th style={{ padding: "14px 18px", width: 260 }}>
                        Email
                      </th>
                      <th style={{ padding: "14px 26px", width: 320 }}>
                        Book
                      </th>
                      <th style={{ padding: "14px 18px", width: 150 }}>
                        Status
                      </th>
                      <th style={{ padding: "14px 18px", width: 220 }}>
                        Requested at
                      </th>
                      <th
                        className="text-center"
                        style={{ padding: "14px 18px", width: 280 }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRequests.map((r, idx) => (
                      <tr key={r._id}>
                        <td style={{ padding: "14px 18px" }}>
                          {startIndex + idx + 1}
                        </td>
                        <td style={{ padding: "14px 26px" }}>
                          <div style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                            {r.user?.name || "-"}
                          </div>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <span className="text-muted">
                            {r.user?.email || "-"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 26px" }}>
                          <div style={{ fontWeight: 600 }}>
                            {r.book?.title || "-"}
                          </div>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <Badge
                            bg={
                              r.status === "approved"
                                ? "success"
                                : r.status === "rejected"
                                ? "danger"
                                : "warning"
                            }
                            pill
                            style={{
                              textTransform: "capitalize",
                              fontSize: "0.82rem",
                              padding: "0.35rem 0.8rem",
                            }}
                          >
                            {r.status}
                          </Badge>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleString()
                            : "-"}
                        </td>
                        <td
                          className="text-center"
                          style={{ padding: "14px 18px" }}
                        >
                          {r.status === "pending" ? (
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                              <Button
                                variant="success"
                                size="sm"
                                disabled={updatingId === r._id}
                                onClick={() =>
                                  handleUpdateStatus(r._id, "approved")
                                }
                                style={{ minWidth: 100 }}
                              >
                                {updatingId === r._id ? "Saving..." : "Approve"}
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                disabled={updatingId === r._id}
                                onClick={() =>
                                  handleUpdateStatus(r._id, "rejected")
                                }
                                style={{ minWidth: 100 }}
                              >
                                {updatingId === r._id ? "Saving..." : "Reject"}
                              </Button>
                            </div>
                          ) : (
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.85rem" }}
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
            )}
          </Card.Body>

          {renderPagination()}
        </Card>
      </Container>
    </div>
  );
}
