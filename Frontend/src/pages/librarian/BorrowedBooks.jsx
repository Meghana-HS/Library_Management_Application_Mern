import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Table, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function BorrowedBooks() {
  const [records, setRecords] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await API.get("/borrow/all");
      setRecords(res.data);
    } catch (err) {
      setMsg("Failed to load borrowed books.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const returnBook = async (id) => {
    try {
      await API.post(`/borrow/return/${id}`);
      setMsg("Book returned successfully.");
      load(); // refresh table
    } catch (err) {
      setMsg(err.response?.data?.message || "Error returning book.");
    }
  };

  return (
    <Card className="p-4 shadow">
      <h2 className="text-center mb-3">Borrowed Books</h2>
      {msg && <Alert variant={msg.includes("success") ? "success" : "danger"}>{msg}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Borrow ID</th>
            <th>Book</th>
            <th>Student</th>
            <th>Issued On</th>
            <th>Return</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r._id}</td>
              <td>{r.book?.title}</td>
              <td>{r.student?.name}</td>
              <td>{new Date(r.issueDate).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => returnBook(r._id)}
                >
                  Return
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button onClick={() => navigate(-1)} className="mt-3">⬅ Go Back</Button>
    </Card>
  );
}
