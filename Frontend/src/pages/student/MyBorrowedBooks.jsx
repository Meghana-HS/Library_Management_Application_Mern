import React, { useEffect, useState } from "react";
import { request } from "../../services/api";
import { Container, Card, Table, Badge, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MyBorrowedBooks() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request("/borrow/my")
      .then(data => setRecords(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-lg rounded-4">
        <Card.Body>
          <h3 className="mb-4">My Borrowed Books</h3>

          {records.length === 0 ? (
            <p>You have not borrowed any books yet.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r._id}>
                    <td>{r.book?.title}</td>
                    <td>
                      {new Date(r.issueDate).toLocaleDateString()}
                    </td>
                    <td>
                      {r.dueDate
                        ? new Date(r.dueDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <Badge bg={r.isReturned ? "success" : "warning"}>
                        {r.isReturned ? "Returned" : "Pending"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
