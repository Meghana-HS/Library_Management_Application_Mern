import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "../../services/api";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditBook() {
  const { id } = useParams(); // get book ID
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [isbn, setIsbn] = useState("");
  const [copies, setCopies] = useState(1);
  const [existingCover, setExistingCover] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  // Load existing book details
  useEffect(() => {
    async function fetchBook() {
      try {
        const b = await request(`/books/${id}`);
        setTitle(b.title);
        setAuthor(b.author);
        setCategory(b.category);
        setIsbn(b.isbn);
        setCopies(b.totalCopies);
        setExistingCover(b.coverUrl);
      } catch (err) {
        setMsg("Failed to load book details");
      }
    }

    fetchBook();
  }, [id]);

  // Submit updated book info
  const submit = async e => {
    e.preventDefault();
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("author", author);
      fd.append("category", category);
      fd.append("isbn", isbn);
      fd.append("totalCopies", copies);
      if (file) fd.append("cover", file); // optional new image

      await request(`/books/${id}`, {
        method: "PUT",
        body: fd,
      });

      setMsg("Book Updated Successfully!");
      navigate("/librarian/manage-books");
    } catch (err) {
      setMsg(err.message || "Error updating book");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url(https://hips.hearstapps.com/hmg-prod/images/marieflaniganht24-ph-julie-soefer-7367-230922-flanigan-lo-res-663e840cdf0df.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Background overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      ></div>

      {/* Go Back Button */}
      <Button
        variant="light"
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 3,
          padding: "8px 16px",
          borderRadius: "8px",
          fontWeight: "600",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        ⬅ Go Back
      </Button>

      <Card
        className="p-4 shadow-lg rounded-4"
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.95)",
          zIndex: 2,
        }}
      >
        <div className="text-center mb-4">
          <FaEdit size={50} style={{ color: "#0077cc" }} />
          <h2 className="mt-2 fw-bold">Edit Book</h2>
          <p className="text-muted">Modify the book details below</p>
        </div>

        {msg && (
          <Alert variant={msg.includes("Successfully") ? "success" : "danger"}>
            {msg}
          </Alert>
        )}

        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="text"
              value={isbn}
              onChange={e => setIsbn(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total Copies</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={copies}
              onChange={e => setCopies(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Existing Cover</Form.Label>
            {existingCover ? (
              <img
                src={existingCover}
                alt="cover"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
            ) : (
              <p className="text-muted">No cover uploaded</p>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Upload New Cover (optional)</Form.Label>
            <Form.Control
              type="file"
              onChange={e => setFile(e.target.files[0])}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
            Update Book
          </Button>
        </Form>
      </Card>
    </div>
  );
}
