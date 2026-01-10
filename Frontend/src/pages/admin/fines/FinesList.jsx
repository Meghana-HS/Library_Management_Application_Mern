// Frontend/src/pages/admin/fines/FinesList.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
// You can even temporarily comment this if it causes errors
// import { request } from "../../../services/api";

export default function FinesList() {
  const [fines, setFines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 🔴 SIMPLE: only set hardcoded data
  useEffect(() => {
    const demoFines = [
      {
        _id: "demo1",
        member: { name: "Meghana" },
        borrowRecord: { book: { title: "Operating System" } },
        daysOverdue: 5,
        amount: 100,
        paidAmount: 0,
        status: "UNPAID",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "demo2",
        member: { name: "Namitha" },
        borrowRecord: { book: { title: "Computer Networks" } },
        daysOverdue: 3,
        amount: 60,
        paidAmount: 20,
        status: "UNPAID",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "demo3",
        member: { name: "Meghana" },
        borrowRecord: { book: { title: "Computer Networks" } },
        daysOverdue: 10,
        amount: 200,
        paidAmount: 200,
        status: "UNPAID",
        createdAt: new Date().toISOString(),
      },
    ];

    setFines(demoFines);
    setCurrentPage(1);
  }, []);

  const totalFines = fines.length;
  const totalAmount = fines.reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalPaid = fines.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const totalUnpaid = totalAmount - totalPaid;

  const totalPages = Math.ceil(fines.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentFines = fines.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
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
          {fines.length === 0 ? 0 : startIndex + 1}–
          {Math.min(endIndex, fines.length)} of {fines.length}
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, #e0ecff 0, #f7fbff 40%, #eef7ff 100%)",
        padding: "32px 0",
      }}
    >
      <Container>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1" style={{ fontWeight: 700, color: "#1b3a57" }}>
              Fines
            </h2>
            <p className="text-muted mb-0">
              Track overdue charges, payments, and pending amounts.
            </p>
          </div>
        </div>

        <Row className="mb-3 g-2">
          <Col md={3}>
            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: "14px", backgroundColor: "#ffffff" }}
            >
              <Card.Body className="py-2">
                <small className="text-muted d-block">Total fines</small>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {totalFines}
                </span>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: "14px", backgroundColor: "#ffffff" }}
            >
              <Card.Body className="py-2">
                <small className="text-muted d-block">Total amount</small>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: "14px", backgroundColor: "#ffffff" }}
            >
              <Card.Body className="py-2">
                <small className="text-muted d-block">Total paid</small>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#16a34a",
                  }}
                >
                  ₹{totalPaid.toFixed(2)}
                </span>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: "14px",
                background:
                  "linear-gradient(145deg, #f97373, #ef4444, #fb7185)",
                color: "#fff",
              }}
            >
              <Card.Body className="py-2">
                <small className="d-block" style={{ opacity: 0.9 }}>
                  Outstanding amount
                </small>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  ₹{totalUnpaid.toFixed(2)}
                </span>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card
          className="shadow-sm border-0"
          style={{ borderRadius: "18px", overflow: "hidden" }}
        >
          <Card.Body style={{ padding: "20px 20px 8px" }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5
                className="mb-0"
                style={{ fontWeight: 600, color: "#183b56" }}
              >
                Fine records
              </h5>
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                Last updated: {new Date().toLocaleString()}
              </span>
            </div>
          </Card.Body>

          <div style={{ borderTop: "1px solid #edf1f7" }}>
            <Table responsive hover size="sm" className="mb-0">
              <thead
                style={{
                  backgroundColor: "#f5f7fb",
                  borderBottom: "1px solid #e3e8f2",
                }}
              >
                <tr>
                  <th>Member</th>
                  <th>Book</th>
                  <th>Days overdue</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {currentFines.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No fines
                    </td>
                  </tr>
                ) : (
                  currentFines.map((f) => (
                    <tr key={f._id}>
                      <td>{f.member?.name}</td>
                      <td
                        style={{
                          fontSize: "0.9rem",
                          color: "#111827",
                        }}
                      >
                        {f.borrowRecord?.book?.title || "Unknown book"}
                      </td>
                      <td>{f.daysOverdue}</td>
                      <td>₹{(f.amount || 0).toFixed(2)}</td>
                      <td>₹{(f.paidAmount || 0).toFixed(2)}</td>
                      <td>
                        <Badge
                          bg={
                            f.status === "PAID"
                              ? "success"
                              : f.status === "PARTIAL"
                              ? "warning"
                              : "danger"
                          }
                          pill
                          className="px-3"
                        >
                          {f.status}
                        </Badge>
                      </td>
                      <td>{new Date(f.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {renderPagination()}
        </Card>
      </Container>
    </div>
  );
}
