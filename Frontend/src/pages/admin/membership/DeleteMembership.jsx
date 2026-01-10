import React from "react";
import { Card, Button, Container } from "react-bootstrap";

export default function DeleteMembership() {
  const remove = () => {
    alert("Membership Deleted!");
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow">
        <Card.Body className="text-center">
          <h3 className="text-danger mb-4">🗑 Delete Membership</h3>
          <p>Are you sure you want to delete the selected membership?</p>

          <Button variant="danger" className="w-100" onClick={remove}>
            Confirm Delete
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
