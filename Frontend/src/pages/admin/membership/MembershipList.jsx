import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Form,
  Badge,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { request } from "../../../services/api";

export default function MembershipList() {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("true");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // 5 documents per page

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const query = new URLSearchParams({
        ...(search ? { search } : {}),
        ...(planFilter ? { planId: planFilter } : {}),
        ...(activeFilter ? { active: activeFilter } : {}),
      }).toString();

      const [membersData, plansData] = await Promise.all([
        request(`/members${query ? `?${query}` : ""}`),
        request("/membership-plans"),
      ]);

      setMembers(membersData);
      setPlans(plansData);
      setCurrentPage(1); // reset to first page when data/filter changes
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async e => {
    e.preventDefault();
    await loadData();
  };

  const handleDelete = async id => {
    try {
      await request(`/members/${id}`, { method: "DELETE" });
      await loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const activeCount = members.filter(m => m.isActive).length;
  const totalOutstanding = members.reduce(
    (sum, m) => sum + (m.totalOutstandingFine || 0),
    0
  );

  // pagination calculations (5 per page)
  const totalPages = Math.ceil(members.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentMembers = members.slice(startIndex, endIndex);

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
          {members.length === 0 ? 0 : startIndex + 1}–
          {Math.min(endIndex, members.length)} of {members.length}
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
          "linear-gradient(135deg, #f0f4ff 0%, #f8fbff 40%, #eef7ff 100%)",
        padding: "32px 0",
      }}
    >
      <Container>
        {/* Header row */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1" style={{ fontWeight: 700, color: "#1b3a57" }}>
              Memberships
            </h2>
            <p className="text-muted mb-0">
              Manage active members, plans, and outstanding fines.
            </p>
          </div>
          <Button
            as={Link}
            to="/admin/memberships/add"
            variant="primary"
            className="mt-3 mt-sm-0"
            style={{
              borderRadius: "999px",
              paddingInline: "20px",
              boxShadow: "0 4px 12px rgba(37,117,252,0.35)",
            }}
          >
            + Add Member
          </Button>
        </div>

        {/* Small summary strip */}
        <Row className="mb-3 g-2">
          <Col md={4}>
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: "14px",
                backgroundColor: "#ffffff",
              }}
            >
              <Card.Body className="py-2">
                <small className="text-muted d-block">Total members</small>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {members.length}
                </span>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: "14px",
                backgroundColor: "#ffffff",
              }}
            >
              <Card.Body className="py-2">
                <small className="text-muted d-block">Active members</small>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {activeCount}
                </span>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
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
                  Total outstanding fines
                </small>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  ₹{totalOutstanding.toFixed(2)}
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
            {/* Filters */}
            <Form onSubmit={handleSearch} className="mb-3">
              <Row className="g-2 align-items-center">
                <Col md={4}>
                  <Form.Control
                    placeholder="Search by name or email"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      borderRadius: "999px",
                      padding: "10px 18px",
                      border: "1px solid #d0ddf2",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    }}
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={planFilter}
                    onChange={e => setPlanFilter(e.target.value)}
                    style={{
                      borderRadius: "999px",
                      padding: "10px 16px",
                      border: "1px solid #d0ddf2",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    }}
                  >
                    <option value="">All plans</option>
                    {plans.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <div className="d-flex gap-1 flex-wrap">
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        activeFilter === "true"
                          ? "success"
                          : "outline-secondary"
                      }
                      onClick={() => setActiveFilter("true")}
                      style={{ borderRadius: "999px" }}
                    >
                      Active
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        activeFilter === "false"
                          ? "secondary"
                          : "outline-secondary"
                      }
                      onClick={() => setActiveFilter("false")}
                      style={{ borderRadius: "999px" }}
                    >
                      Inactive
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        activeFilter === "" ? "info" : "outline-secondary"
                      }
                      onClick={() => setActiveFilter("")}
                      style={{ borderRadius: "999px" }}
                    >
                      All
                    </Button>
                  </div>
                </Col>
                <Col md={2} className="text-md-end mt-2 mt-md-0">
                  <Button
                    type="submit"
                    variant="outline-primary"
                    style={{
                      borderRadius: "999px",
                      paddingInline: "18px",
                    }}
                  >
                    Apply
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>

          {/* Table */}
          <div style={{ borderTop: "1px solid #edf1f7" }}>
            <Table responsive hover size="sm" className="mb-0">
              <thead
                style={{
                  backgroundColor: "#f5f7fb",
                  borderBottom: "1px solid #e3e8f2",
                }}
              >
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Join</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Outstanding</th>
                  <th style={{ width: 180 }} className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-4">
                      No members found
                    </td>
                  </tr>
                ) : (
                  currentMembers.map(m => (
                    <tr key={m._id}>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.plan?.name}</td>
                      <td>{new Date(m.joinDate).toLocaleDateString()}</td>
                      <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                      <td>
                        <Badge
                          bg={m.isActive ? "success" : "secondary"}
                          pill
                          className="px-3"
                        >
                          {m.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 600,
                            color:
                              (m.totalOutstandingFine || 0) > 0
                                ? "#d6336c"
                                : "#198754",
                          }}
                        >
                          ₹{(m.totalOutstandingFine || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                          style={{
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            padding: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Edit member"
                          onClick={() =>
                            navigate(`/admin/memberships/edit/${m._id}`)
                          }
                        >
                          <FaEdit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          style={{
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            padding: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Deactivate member"
                          onClick={() => handleDelete(m._id)}
                        >
                          <FaTrashAlt size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination below table */}
          {renderPagination()}
        </Card>
      </Container>
    </div>
  );
}
