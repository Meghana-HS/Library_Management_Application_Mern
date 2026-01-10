import React, { useEffect, useState } from "react";
import { request } from "../../services/api";
import { Link } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Badge,
  Spinner,
  Button,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SearchBooks() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [priorityRequestingId, setPriorityRequestingId] = useState(null);
  const [message, setMessage] = useState(null); // { type, text }

  useEffect(() => {
    request("/books")
      .then((data) => setBooks(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(q.toLowerCase())
  );

  // Normal request (for available books)
  const handleRequest = async (bookId, title) => {
    const confirmed = window.confirm(
      `Do you want to request "${title}" from the librarian?`
    );
    if (!confirmed) return;

    try {
      setRequestingId(bookId);
      setMessage(null);
      await request("/requests", {
        method: "POST",
        body: JSON.stringify({ bookId }),
      });
      setMessage({
        type: "success",
        text: `Your request for "${title}" has been sent to the librarian.`,
      });
    } catch (err) {
      setMessage({
        type: "danger",
        text: err.message || "Could not send request. Please try again.",
      });
    } finally {
      setRequestingId(null);
    }
  };

  // Priority request (for out-of-stock books)
  const handlePriorityRequest = async (bookId, title) => {
    const confirmed = window.confirm(
      `This book is currently out of stock.\n\nDo you want to join the PRIORITY queue for "${title}"?`
    );
    if (!confirmed) return;

    try {
      setPriorityRequestingId(bookId);
      setMessage(null);
      await request("/priority-requests", {
        method: "POST",
        body: JSON.stringify({ bookId }),
      });
      setMessage({
        type: "success",
        text: `You have been added to the priority queue for "${title}".`,
      });
    } catch (err) {
      setMessage({
        type: "danger",
        text:
          err.message ||
          "Could not create priority request. Please try again.",
      });
    } finally {
      setPriorityRequestingId(null);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner />
      </Container>
    );
  }

  const alertVariant =
    message && (message.text.includes("limit") || message.text.includes("priority"))
      ? "warning"
      : message?.type || "info";

  return (
    <Container className="py-5">
      {/* Header + search */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">Find Your Next Book</h2>
        <p className="text-muted">
          Search the library catalogue and send a normal or priority request to
          the librarian.
        </p>
        <Form.Control
          type="text"
          placeholder="Search by title..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            borderRadius: "999px",
            padding: "10px 18px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
            border: "1px solid #dde3ec",
            fontSize: "0.95rem",
          }}
        />
      </div>

      {/* Global message */}
      {message && (
        <Alert
          variant={alertVariant}
          onClose={() => setMessage(null)}
          dismissible
        >
          {message.text}
        </Alert>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted">
          No books found. Try a different keyword.
        </p>
      ) : (
        <Row className="g-4">
          {filtered.map((b) => (
            <Col md={4} key={b._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{b.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {b.author}
                  </Card.Subtitle>

                  <div className="mb-2">
                    <Badge bg="info" className="me-2">
                      {b.category || "General"}
                    </Badge>
                    {b.availableCopies > 0 ? (
                      <Badge bg="success">
                        {b.availableCopies} Available
                      </Badge>
                    ) : (
                      <Badge bg="danger">Out of Stock</Badge>
                    )}
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      as={Link}
                      to={`/student/book/${b._id}`}
                      variant="outline-primary"
                      size="sm"
                    >
                      Details
                    </Button>

                    {b.availableCopies > 0 ? (
                      // Normal request button
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={
                          requestingId === b._id ||
                          priorityRequestingId === b._id
                        }
                        onClick={() => handleRequest(b._id, b.title)}
                      >
                        {requestingId === b._id ? "Requesting..." : "Request"}
                      </Button>
                    ) : (
                      // Priority request button when out of stock
                      <Button
                        variant="warning"
                        size="sm"
                        disabled={priorityRequestingId === b._id}
                        onClick={() => handlePriorityRequest(b._id, b.title)}
                      >
                        {priorityRequestingId === b._id
                          ? "Joining queue..."
                          : "Priority Request"}
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
