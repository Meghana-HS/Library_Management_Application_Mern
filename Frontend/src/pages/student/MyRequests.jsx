import React, { useEffect, useState, useMemo } from "react";
import { request } from "../../services/api";
import {
  Container,
  Badge,
  Spinner,
  Alert,
  Card,
  Row,
  Col,
  ListGroup,
  Form,
  Pagination,
} from "react-bootstrap";
import {
  FaListUl,
  FaBolt,
  FaCircle,
  FaClock,
  FaCheck,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

export default function MyRequests() {
  const [normalRequests, setNormalRequests] = useState([]);
  const [priorityRequests, setPriorityRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // search + pagination for normal
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr("");

        const reqs = await request("/requests/mine");
        setNormalRequests(reqs || []);

        const priReqs = await request("/priority-requests/my");
        setPriorityRequests(priReqs || []);

        setLoading(false);
      } catch (e) {
        console.error(e);
        setErr(e.message || "Failed to load requests");
        setLoading(false);
      }
    }
    load();
  }, []);

  // filter + pagination
  const filteredNormal = useMemo(() => {
    if (!searchQuery.trim()) return normalRequests;
    const q = searchQuery.toLowerCase();
    return normalRequests.filter((r) => {
      const title = r.book?.title?.toLowerCase() || "";
      const author = r.book?.author?.toLowerCase() || "";
      const status = r.status?.toLowerCase() || "";
      return title.includes(q) || author.includes(q) || status.includes(q);
    });
  }, [normalRequests, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredNormal.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);

  const paginatedNormal = useMemo(() => {
    const start = (currentPageSafe - 1) * pageSize;
    return filteredNormal.slice(start, start + pageSize);
  }, [filteredNormal, currentPageSafe, pageSize]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #e0f2fe 0%, #e5e7eb 40%, #fee2e2 100%)",
        }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  const statusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "APPROVED":
        return "info";
      case "FULFILLED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "secondary";
    }
  };

  const statusDotColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#fbbf24";
      case "APPROVED":
        return "#38bdf8";
      case "FULFILLED":
        return "#22c55e";
      case "REJECTED":
        return "#ef4444";
      default:
        return "#9ca3af";
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <FaClock style={{ marginRight: 4 }} />;
      case "APPROVED":
        return <FaCheck style={{ marginRight: 4 }} />;
      case "FULFILLED":
        return <FaCheck style={{ marginRight: 4 }} />;
      case "REJECTED":
        return <FaTimes style={{ marginRight: 4 }} />;
      default:
        return null;
    }
  };

  const sortedPriority = priorityRequests || [];

  const renderPageItems = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPageSafe}
          onClick={() => handlePageClick(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        background:
          "linear-gradient(135deg, #e0f2fe 0%, #e5e7eb 40%, #fee2e2 100%)",
      }}
    >
      <Container
        fluid
        className="d-flex flex-column"
        style={{
          minHeight: "100vh",
          padding: "16px 24px",
        }}
      >
        {/* Top bar */}
        <Row className="mb-3">
          <Col>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: 16,
                padding: "10px 16px",
                boxShadow: "0 6px 18px rgba(15,23,42,0.12)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                    boxShadow: "0 8px 18px rgba(79,70,229,0.35)",
                  }}
                >
                  <FaListUl size={20} style={{ color: "#f9fafb" }} />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#111827",
                    }}
                  >
                    My Requests
                  </div>
                  <small style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                    Priority and normal requests in one place
                  </small>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {err && (
          <Row className="mb-2">
            <Col>
              <Alert variant="danger" className="mb-2">
                {err}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Two cards: priority + normal */}
        <Row className="g-3 flex-grow-1" style={{ marginBottom: 0 }}>
          {/* Priority */}
          <Col lg={6} className="d-flex">
            <Card
              className="border-0 shadow-sm flex-grow-1"
              style={{ borderRadius: 14 }}
            >
              <Card.Header
                className="bg-white d-flex align-items-center justify-content-between"
                style={{ borderRadius: "14px 14px 0 0" }}
              >
                <div className="d-flex align-items-center">
                  <FaBolt className="me-2" style={{ color: "#f97316" }} />
                  <span className="fw-semibold">Priority queue</span>
                </div>
                <Badge bg="light" text="dark">
                  {sortedPriority.length} total
                </Badge>
              </Card.Header>
              <Card.Body
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "0 0 14px 14px",
                  padding: "8px",
                }}
              >
                {sortedPriority.length === 0 ? (
                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: "0.9rem" }}
                  >
                    No priority requests yet.
                  </p>
                ) : (
                  <ListGroup variant="flush">
                    {sortedPriority.map((r, idx) => (
                      <ListGroup.Item
                        key={r._id}
                        className="border-0 mb-2"
                        style={{
                          borderRadius: 10,
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <div className="d-flex">
                          <div className="me-3 mt-1">
                            <FaCircle
                              size={10}
                              style={{ color: statusDotColor(r.status) }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <div className="fw-semibold">
                                {r.book?.title || "Unknown book"}
                              </div>
                              <Badge bg="light" text="dark" pill>
                                Rank #{r.bookRank ?? r.globalRank ?? idx + 1}
                              </Badge>
                            </div>
                            <div className="mb-1">
                              <Badge
                                bg={statusColor(r.status)}
                                className="me-2"
                              >
                                {statusIcon(r.status)}
                                {r.status}
                              </Badge>
                              <Badge bg="primary">
                                Score: {r.priorityScore}
                              </Badge>
                            </div>
                            <small className="text-muted">
                              {new Date(r.createdAt).toLocaleString()}
                            </small>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Normal – bigger, more spacious */}
          <Col lg={6} className="d-flex">
            <Card
              className="border-0 shadow-sm flex-grow-1"
              style={{ borderRadius: 14, overflow: "hidden" }}
            >
              {/* small gradient strip */}
              <div
                style={{
                  height: 4,
                  background:
                    "linear-gradient(90deg, #22c55e, #3b82f6, #a855f7)",
                }}
              />

              <Card.Header
                className="bg-white d-flex align-items-center justify-content-between"
                style={{
                  borderRadius: "0 0 0 0",
                  borderBottom: "none",
                  padding: "14px 16px",
                }}
              >
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 999,
                      background: "rgba(59,130,246,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <FaListUl size={18} style={{ color: "#2563eb" }} />
                  </div>
                  <div>
                    <span
                      className="fw-semibold"
                      style={{ fontSize: "1rem", color: "#111827" }}
                    >
                      Normal requests
                    </span>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                      Your regular queue activity
                    </div>
                  </div>
                </div>
                <Badge
                  bg="light"
                  text="dark"
                  style={{ fontSize: "0.8rem" }}
                >
                  {filteredNormal.length} shown
                </Badge>
              </Card.Header>

              {/* New search bar – larger, cleaner */}
              <div
                style={{
                  padding: "10px 16px 8px",
                  backgroundColor: "#f3f4f6",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: 999,
                    padding: "6px 12px",
                    boxShadow: "0 0 0 1px rgba(148,163,184,0.4)",
                  }}
                >
                  <FaSearch
                    size={14}
                    color="#6b7280"
                    style={{ marginRight: 8 }}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Search by title, author, or status"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{
                      border: "none",
                      boxShadow: "none",
                      fontSize: "0.9rem",
                      padding: 0,
                    }}
                  />
                </div>
              </div>

              <Card.Body
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "0 0 14px 14px",
                  padding: "12px 12px 8px",
                  maxHeight: "440px",
                  overflowY: "auto",
                }}
              >
                {paginatedNormal.length === 0 ? (
                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: "0.95rem", padding: "8px 4px" }}
                  >
                    No normal requests match your search.
                  </p>
                ) : (
                  <ListGroup variant="flush">
                    {paginatedNormal.map((r, index) => (
                      <ListGroup.Item
                        key={r._id}
                        className="border-0 mb-3"
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f3f4f6",
                          borderRadius: 14,
                          padding: "12px 14px",
                          boxShadow:
                            index === 0
                              ? "0 4px 12px rgba(15,23,42,0.10)"
                              : "0 1px 3px rgba(15,23,42,0.05)",
                        }}
                      >
                        <div className="d-flex">
                          {/* left dot */}
                          <div className="me-3 mt-1">
                            <FaCircle
                              size={11}
                              style={{ color: statusDotColor(r.status) }}
                            />
                          </div>

                          <div className="flex-grow-1">
                            {/* title + status */}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div
                                className="fw-semibold"
                                style={{
                                  fontSize: "1rem",
                                  color: "#111827",
                                  lineHeight: 1.3,
                                }}
                              >
                                {r.book?.title || "Unknown book"}
                              </div>

                              {r.status === "APPROVED" ? (
                                <span
                                  style={{
                                    padding: "4px 12px",
                                    borderRadius: 999,
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    background:
                                      "linear-gradient(135deg,#bfdbfe,#60a5fa)",
                                    color: "#0f172a",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    boxShadow:
                                      "0 2px 6px rgba(37,99,235,0.35)",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <FaCheck
                                    style={{
                                      marginRight: 5,
                                      fontSize: "0.8rem",
                                    }}
                                  />
                                  Approved
                                </span>
                              ) : (
                                <Badge
                                  bg={statusColor(r.status)}
                                  style={{
                                    fontSize: "0.78rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "4px 8px",
                                  }}
                                >
                                  {statusIcon(r.status)}
                                  {r.status}
                                </Badge>
                              )}
                            </div>

                            {r.book?.author && (
                              <small
                                className="text-muted d-block mb-2"
                                style={{ fontSize: "0.85rem" }}
                              >
                                by {r.book.author}
                              </small>
                            )}

                            <div className="d-flex justify-content-between align-items-center">
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.8rem" }}
                              >
                                {new Date(r.createdAt).toLocaleString()}
                              </small>
                              <small
                                style={{
                                  fontSize: "0.78rem",
                                  color: "#6b7280",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <FaClock size={11} />
                                Normal request
                              </small>
                            </div>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>

              {filteredNormal.length > pageSize && (
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    padding: "8px 16px 10px",
                    borderTop: "1px solid #e5e7eb",
                    backgroundColor: "#f9fafb",
                    fontSize: "0.8rem",
                  }}
                >
                  <small className="text-muted">
                    Page {currentPageSafe} of {totalPages}
                  </small>
                  <Pagination size="sm" className="mb-0">
                    {renderPageItems()}
                  </Pagination>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
