import React, { useEffect, useState } from "react";
import { request } from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Badge, Button, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    request(`/books/${id}`)
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handlePriorityRequest = async () => {
    try {
      setMsg("");
      await request("/priority-requests", {
        method: "POST",
        body: JSON.stringify({ bookId: book._id }),
      });
      setMsg("You have been added to the priority queue for this book.");
    } catch (err) {
      setMsg(err.message || "Could not create priority request");
    }
  };

  const handleIssue = () => {
    // adjust to your routing if you already have an IssueBook page
    navigate("/student/issue", { state: { bookId: book._id } });
  };

  if (loading || !book) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <Container className="py-4">
      <Button variant="link" onClick={() => navigate(-1)} className="mb-3">
        ← Back to Books
      </Button>

      <Card className="p-4 shadow-sm">
        <h2 className="mb-3">{book.title}</h2>
        <p className="mb-1">
          <strong>Author:</strong> {book.author}
        </p>
        <p className="mb-1">
          <strong>Category:</strong> {book.category}
        </p>
        <p className="mb-3">
          <strong>Available:</strong>
          <Badge bg={isAvailable ? "success" : "danger"} className="ms-2">
            {book.availableCopies}
          </Badge>
        </p>

        {msg && (
          <Alert
            variant={
              msg.toLowerCase().includes("added") ||
              msg.toLowerCase().includes("success")
                ? "success"
                : "danger"
            }
          >
            {msg}
          </Alert>
        )}

        {isAvailable ? (
          <Button onClick={handleIssue}>Issue Book</Button>
        ) : (
          <>
            <p className="text-danger mb-2">
              No copies available right now. Join the priority queue to get the
              next available copy.
            </p>
            <Button variant="outline-primary" onClick={handlePriorityRequest}>
              Request with priority
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
}
