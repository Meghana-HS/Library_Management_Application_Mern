import React, { useState } from 'react';
import { request } from '../../services/api';

import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBook } from 'react-icons/fa';

export default function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [isbn, setIsbn] = useState('');
  const [copies, setCopies] = useState(1);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('author', author);
      fd.append('category', category);
      fd.append('isbn', isbn);
      fd.append('totalCopies', copies);
      if (file) fd.append('cover', file);

     await request("/books", {
  method: "POST",
  body: fd,
});


      setMsg('Book Added Successfully!');
      navigate('/librarian/manage-books');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error adding book');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        position: 'relative',
      }}
    >
      {/* Overlay for readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        }}
      ></div>

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
          maxWidth: '800px',
          width: '100%',
          backgroundColor: 'rgba(255,255,255,0.95)',
          zIndex: 2
        }}
      >
        <div className="text-center mb-4">
          <FaBook size={50} style={{ color: '#0077cc' }} />
          <h2 className="mt-2 fw-bold">Add New Book</h2>
          <p className="text-muted">Enter book details to add to the library</p>
        </div>

        {msg && <Alert variant={msg.includes('Successfully') ? 'success' : 'danger'}>{msg}</Alert>}

        <Form onSubmit={submit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formTitle" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Book title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formAuthor" className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Author name"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formCategory" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Book category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formISBN" className="mb-3">
                <Form.Label>ISBN</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ISBN number"
                  value={isbn}
                  onChange={e => setIsbn(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4 align-items-center">
            <Col md={4}>
              <Form.Group controlId="formCopies">
                <Form.Label>Copies</Form.Label>
                <Form.Control
                  type="number"
                  value={copies}
                  min="1"
                  onChange={e => setCopies(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={8}>
              <Form.Group controlId="formFile">
                <Form.Label>Cover Image</Form.Label>
                <Form.Control type="file" onChange={e => setFile(e.target.files[0])} />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
            Add Book
          </Button>
        </Form>
      </Card>
    </div>
  );
}
