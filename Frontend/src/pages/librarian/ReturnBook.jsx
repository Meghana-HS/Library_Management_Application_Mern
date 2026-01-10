import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Badge,
  Row,
  Col,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { FaArrowCircleRight } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { request } from "../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function ReturnBook() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const load = async () => {
    try {
      const data = await request("/borrow/all");
      const cleaned = (data || []).filter(r => r.book && r.book.title);
      setRecords(cleaned);
      setCurrentPage(1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleReturn = async id => {
    try {
      await request(`/borrow/return/${id}`, { method: "POST" });
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const totalCount = records.length;
  const returnedCount = records.filter(r => r.isReturned).length;
  const issuedCount = totalCount - returnedCount;
  const issuedPercent = totalCount ? Math.round((issuedCount / totalCount) * 100) : 0;
  const returnedPercent = totalCount ? Math.round((returnedCount / totalCount) * 100) : 0;

  // chart data – smooth area line
  const chartData = {
    labels: ["Total", "Issued", "Returned"],
    datasets: [
      {
        label: "Books",
        data: [totalCount, issuedCount, returnedCount],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.12)",
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#ffffff",
        pointRadius: 4,
        borderWidth: 2,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: "#6b7280", font: { size: 11 } },
        grid: { color: "#e5e7eb" },
      },
    },
  };

  // pagination calculations
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRecords = records.slice(startIndex, endIndex);

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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-3 px-md-4 py-3 border-top gap-2 bg-white">
        <small className="text-muted" style={{ fontSize: "0.9rem" }}>
          Page {currentPage} of {totalPages} · Showing{" "}
          {totalCount === 0 ? 0 : startIndex + 1}–
          {Math.min(endIndex, totalCount)} of {totalCount}
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

  const formatDateTime = d => {
    if (!d) return "-";
    return new Date(d).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container
        className="py-5 d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" className="mb-3" />
        <div className="text-muted">Loading borrow records...</div>
      </Container>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "24px 0",
      }}
    >
      <Container fluid className="px-4 px-md-5">
        {/* Header row */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1" style={{ fontWeight: 700, color: "#111827" }}>
              Returns
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "0.96rem" }}>
              Track issued books and confirm their return.
            </p>
          </div>
        </div>

        {/* Compact statistics row */}
        <Row className="mb-3">
          <Col>
            <div
              className="d-flex flex-wrap align-items-center gap-3 py-2 px-3"
              style={{
                backgroundColor: "#eef2ff",
                borderRadius: 10,
                border: "1px solid #e0e7ff",
              }}
            >
              <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                <strong>Total</strong>: {totalCount}
              </span>
              <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                <strong>Issued</strong>: {issuedCount} ({issuedPercent}%)
              </span>
              <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                <strong>Returned</strong>: {returnedCount} ({returnedPercent}%)
              </span>
            </div>
          </Col>
        </Row>

        {/* Attractive small area chart */}
        <Card
          className="shadow-sm border-0 mb-3"
          style={{ borderRadius: 16 }}
        >
          <Card.Body style={{ padding: "16px 18px 18px" }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0" style={{ fontWeight: 600 }}>
                Borrow overview
              </h6>
              <small className="text-muted">
                Total vs issued vs returned books
              </small>
            </div>
            <div style={{ height: 190 }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </Card.Body>
        </Card>

        {/* Main card + table */}
        <Card
          className="shadow-sm border-0"
          style={{ borderRadius: 16, overflow: "hidden" }}
        >
          <Card.Body style={{ padding: "20px 20px 12px" }}>
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px" }}>
              <Table
                responsive
                hover
                striped
                bordered
                size="sm"
                className="mb-0"
              >
                <thead
                  style={{
                    backgroundColor: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <tr>
                    <th style={{ padding: "10px 12px" }}>Student</th>
                    <th style={{ padding: "10px 12px" }}>Book</th>
                    <th style={{ padding: "10px 12px" }}>Issued</th>
                    <th style={{ padding: "10px 12px" }}>Due</th>
                    <th style={{ padding: "10px 12px" }}>Status</th>
                    <th
                      className="text-center"
                      style={{ width: 220, padding: "10px 12px" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-muted"
                        style={{ padding: "24px 12px" }}
                      >
                        No records found
                      </td>
                    </tr>
                  ) : (
                    currentRecords.map(r => (
                      <tr key={r._id}>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 600 }}>
                            {r.student?.name || "-"}
                          </div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.8rem", marginTop: 2 }}
                          >
                            {r.student?.email}
                          </div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 600 }}>
                            {r.book?.title}
                          </div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.8rem", marginTop: 2 }}
                          >
                            {r.book?.author}
                          </div>
                        </td>
                        <td
                          style={{ fontSize: "0.84rem", padding: "10px 12px" }}
                        >
                          {formatDateTime(r.createdAt)}
                        </td>
                        <td
                          style={{ fontSize: "0.84rem", padding: "10px 12px" }}
                        >
                          {formatDateTime(r.dueDate)}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <Badge
                            bg={r.isReturned ? "success" : "warning"}
                            pill
                            className="px-3"
                            style={{ fontSize: "0.78rem" }}
                          >
                            {r.isReturned ? "Returned" : "Issued"}
                          </Badge>
                        </td>
                        <td
                          className="text-center"
                          style={{ padding: "10px 12px" }}
                        >
                          {!r.isReturned ? (
                            <Button
                              size="sm"
                              variant="primary"
                              style={{
                                borderRadius: "999px",
                                paddingInline: "20px",
                                fontSize: "0.82rem",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                              onClick={() => handleReturn(r._id)}
                            >
                              <FaArrowCircleRight size={13} />
                              Confirm return
                            </Button>
                          ) : (
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.78rem" }}
                            >
                              No action
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>

          {renderPagination()}
        </Card>
      </Container>
    </div>
  );
}
