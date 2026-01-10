import React, { useEffect, useState } from "react";
import { request } from "../../services/api";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Table,
  Badge,
  Modal,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBookOpen, FaUserGraduate, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function IssueBook() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [studentQuery, setStudentQuery] = useState("");

  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [days, setDays] = useState(14);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // pagination for student list
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await request("/admin/approved-students");
        setStudents(data || []);
      } catch (err) {
        console.error(err);
        setMsg(err.message || "Error loading students.");
      }
    };
    loadStudents();
  }, []);

  useEffect(() => {
    const loadRequests = async () => {
      if (!selectedStudent) {
        setRequests([]);
        setSelectedRequestId("");
        return;
      }
      try {
        setMsg("");
        setRequests([]);
        setSelectedRequestId("");

        const reqs = await request(
          `/requests?${new URLSearchParams({ userId: selectedStudent._id })}`
        );
        const approvedForStudent = (reqs || []).filter(
          (r) => r.user?._id === selectedStudent._id && r.status === "approved"
        );
        setRequests(approvedForStudent);
        if (approvedForStudent.length === 0) {
          setMsg("This student has no approved requests to issue.");
        }
      } catch (err) {
        console.error(err);
        setMsg(err.message || "Error loading requests.");
      }
    };

    loadRequests();
  }, [selectedStudent]);

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!selectedRequestId) {
      setMsg("Select a request to issue.");
      return;
    }
    const reqObj = requests.find((r) => r._id === selectedRequestId);
    if (!reqObj) {
      setMsg("Invalid request selected.");
      return;
    }
    try {
      setMsg("");
      await request("/borrow/issue", {
        method: "POST",
        body: JSON.stringify({
          bookId: reqObj.book._id,
          studentId: reqObj.user._id,
          minutes: Number(days) * 24 * 60,
        }),
      });
      setMsg("Book issued successfully.");
      setSelectedRequestId("");
    } catch (err) {
      console.error(err);
      setMsg(
        err.message ||
          "Error issuing book. (If this book has priority requests or the member reached their limit, issuing may be blocked.)"
      );
    }
  };

  const alertVariant =
    msg &&
    (msg.includes("priority requests") ||
      msg.includes("limit") ||
      msg.includes("Borrowing limit"))
      ? "warning"
      : "info";

  // filter + paginate students
  const filteredStudentsAll = students.filter((s) => {
    const q = studentQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  });
  const totalPages = Math.max(1, Math.ceil(filteredStudentsAll.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedStudents = filteredStudentsAll.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  useEffect(() => {
    setPage(1);
  }, [studentQuery]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "24px 0",
      }}
    >
      <Container style={{ maxWidth: 1100 }}>
        <Button
          variant="outline-secondary"
          onClick={() => navigate(-1)}
          className="mb-3"
        >
          ⬅ Back
        </Button>

        <Card
          className="border-0 shadow-sm mb-3"
          style={{ borderRadius: 18, backgroundColor: "#ffffff" }}
        >
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: 12,
                }}
              >
                <FaBookOpen size={22} />
              </div>
              <div>
                <h4 className="mb-0" style={{ color: "#111827" }}>
                  Issue Book
                </h4>
                <small style={{ color: "#6b7280" }}>
                  Choose a student, then issue one of their approved requests.
                </small>
              </div>
            </div>
          </Card.Body>
        </Card>

        {msg && (
          <Alert variant={alertVariant} className="mb-3">
            {msg}
          </Alert>
        )}

        <div className="row g-3">
          {/* Student card */}
          <div className="col-lg-4">
            <Card
              className="h-100 border-0"
              style={{ borderRadius: 16, backgroundColor: "#ffffff" }}
            >
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      backgroundColor: "#22c55e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      marginRight: 8,
                    }}
                  >
                    <FaUserGraduate size={16} />
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ color: "#1f2937" }}>
                      Student
                    </div>
                    <small style={{ color: "#6b7280" }}>
                      All approved members
                    </small>
                  </div>
                </div>

                <p className="small text-muted">
                  Click the button to search and select a student. No need to
                  remember emails.
                </p>

                <Button
                  variant="primary"
                  className="w-100 mb-3"
                  style={{ borderRadius: 999 }}
                  onClick={() => setShowPicker(true)}
                >
                  <FaSearch className="me-2" />
                  {selectedStudent ? "Change student" : "Choose student"}
                </Button>

                <hr />

                {selectedStudent ? (
                  <>
                    <div className="small text-muted mb-1">Selected</div>
                    <div className="fw-semibold" style={{ color: "#111827" }}>
                      {selectedStudent.name}
                    </div>
                    <div className="small text-muted">
                      {selectedStudent.email}
                    </div>
                  </>
                ) : (
                  <div className="small text-muted">
                    No student selected yet.
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* Issue + table */}
          <div className="col-lg-8">
            <Card
              className="border-0 mb-3"
              style={{ borderRadius: 16, backgroundColor: "#ffffff" }}
            >
              <Card.Body>
                <div className="mb-3">
                  <div
                    className="fw-semibold"
                    style={{ color: "#111827", fontSize: "1rem" }}
                  >
                    Issue details
                  </div>
                  <small style={{ color: "#6b7280" }}>
                    Pick an approved request and set the borrowing duration.
                  </small>
                </div>

                {selectedStudent ? (
                  <Form onSubmit={handleIssue}>
                    <div className="row g-3">
                      <div className="col-md-8">
                        <Form.Group controlId="request">
                          <Form.Label className="small text-muted">
                            Approved requests
                          </Form.Label>
                          <Form.Select
                            value={selectedRequestId}
                            onChange={(e) =>
                              setSelectedRequestId(e.target.value)
                            }
                          >
                            <option value="">Select a request</option>
                            {requests.map((r) => (
                              <option key={r._id} value={r._id}>
                                {r.book?.title} –{" "}
                                {new Date(
                                  r.createdAt
                                ).toLocaleString()}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group controlId="days">
                          <Form.Label className="small text-muted">
                            Days to issue
                          </Form.Label>
                          <Form.Control
                            type="number"
                            min={1}
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Button type="submit" variant="success">
                        Issue Book
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <p className="small text-muted mb-0">
                    Select a student first to see their approved requests.
                  </p>
                )}
              </Card.Body>
            </Card>

            <Card
              className="border-0"
              style={{ borderRadius: 16, backgroundColor: "#ffffff" }}
            >
              <Card.Body>
                <div
                  className="fw-semibold mb-2"
                  style={{ color: "#111827" }}
                >
                  Approved requests
                </div>
                {selectedStudent ? (
                  <Table hover size="sm" className="mb-0">
                    <thead style={{ backgroundColor: "#f9fafb" }}>
                      <tr>
                        <th>Book</th>
                        <th>Status</th>
                        <th>Requested At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r._id}>
                          <td>{r.book?.title}</td>
                          <td>
                            <Badge bg="success" pill>
                              Approved
                            </Badge>
                          </td>
                          <td>
                            {r.createdAt
                              ? new Date(
                                  r.createdAt
                                ).toLocaleString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                      {requests.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center text-muted">
                            No approved requests.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                ) : (
                  <p className="small text-muted mb-0">
                    Approved requests will appear here after selecting a
                    student.
                  </p>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>

      {/* Student picker modal with pagination */}
      <Modal
        show={showPicker}
        onHide={() => setShowPicker(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            placeholder="Search by name or email..."
            value={studentQuery}
            onChange={(e) => setStudentQuery(e.target.value)}
            className="mb-3"
          />

          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {filteredStudentsAll.length === 0 ? (
              <p className="text-muted small mb-0">
                No students match this search.
              </p>
            ) : (
              pagedStudents.map((s) => (
                <div
                  key={s._id}
                  className="d-flex justify-content-between align-items-center p-2 mb-2 rounded"
                  style={{
                    cursor: "pointer",
                    border: "1px solid #e5e7eb",
                    background:
                      s._id === selectedStudent?._id
                        ? "#e5f0ff"
                        : "#ffffff",
                  }}
                  onClick={() => {
                    setSelectedStudent(s);
                    setShowPicker(false);
                  }}
                >
                  <div>
                    <div className="fw-semibold">{s.name}</div>
                    <div className="text-muted small">{s.email}</div>
                  </div>
                  <Badge bg="primary" pill>
                    Select
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="small text-muted">
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </div>
          <div>
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
