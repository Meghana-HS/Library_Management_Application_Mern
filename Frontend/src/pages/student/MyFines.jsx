// src/pages/student/MyFines.jsx
import React, { useEffect, useState } from "react";
import { Container, Card, Table, Badge, Spinner, Button } from "react-bootstrap";
import { request } from "../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MyFines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const load = async () => {
    try {
      const data = await request("/fines/my");
      setFines(data || []);
    } catch (e) {
      console.error("Load fines error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlePay = async (id, amount) => {
    try {
      setPayingId(id);
      await request(`/fines/${id}/pay`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
      await load();
    } catch (e) {
      console.error("Pay fine error:", e);
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header>
          <h4 className="mb-0">My Fines</h4>
        </Card.Header>
        <Card.Body>
          {fines.length === 0 ? (
            <p>You do not have any fines.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Days Overdue</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fines.map(f => (
                  <tr key={f._id}>
                    <td>{f.borrowRecord?.book?.title || "Book"}</td>
                    <td>{f.daysOverdue}</td>
                    <td>{f.amount}</td>
                    <td>
                      <Badge
                        bg={
                          f.status === "PAID"
                            ? "success"
                            : f.status === "PARTIAL"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {f.status || "PENDING"}
                      </Badge>
                    </td>
                    <td>
                      {f.status === "PAID" ? (
                        "Paid"
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={payingId === f._id}
                          onClick={() => handlePay(f._id, f.amount)}
                        >
                          {payingId === f._id ? "Paying..." : "Pay"}
                        </Button>
                      )}
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
