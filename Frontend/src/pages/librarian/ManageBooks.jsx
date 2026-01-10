import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { request } from "../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // books per page

  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await request("/books");
      setBooks(data);
      setCurrentPage(1); // reset to first page when data changes
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const del = async id => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await request(`/books/${id}`, { method: "DELETE" });
        await load();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // pagination calculations
  const totalPages = Math.ceil(books.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBooks = books.slice(startIndex, endIndex);

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
          {books.length === 0 ? 0 : startIndex + 1}–
          {Math.min(endIndex, books.length)} of {books.length}
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
    <Container className="py-5">
      <Card className="shadow-lg rounded-4">
        <Card.Body>
          <h2 className="mb-4 text-center">Manage Books</h2>

          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Available</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentBooks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No books found.
                  </td>
                </tr>
              ) : (
                currentBooks.map(b => (
                  <tr key={b._id}>
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>
                      {b.availableCopies}/{b.totalCopies}
                    </td>
                    <td className="text-center">
                      {/* Green circular edit button */}
                      <Button
                        size="sm"
                        variant="success"
                        className="me-2 text-white"
                        style={{
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          padding: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Edit book"
                        onClick={() =>
                          navigate(`/librarian/edit-book/${b._id}`)
                        }
                      >
                        <FaEdit size={14} />
                      </Button>

                      {/* Red circular delete button */}
                      <Button
                        size="sm"
                        variant="danger"
                        className="text-white"
                        style={{
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          padding: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Delete book"
                        onClick={() => del(b._id)}
                      >
                        <FaTrashAlt size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>

        {/* Pagination below table */}
        {renderPagination()}
      </Card>
    </Container>
  );
}
