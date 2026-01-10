// src/pages/admin/AdminEmailJobs.jsx
import React, { useState } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { request } from "../../services/api";

export default function AdminEmailJobs() {
  const [status, setStatus] = useState("");
  const [loadingKey, setLoadingKey] = useState("");
  const [daysAhead, setDaysAhead] = useState(7);

  const callJob = async (key, url, body = null) => {
    setStatus("");
    setLoadingKey(key);
    try {
      const res = await request(url, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      });
      setStatus(res.message || `Job ${key} completed (count: ${res.count ?? "?"})`);
    } catch (e) {
      setStatus(e.message || `Failed to run job: ${key}`);
    } finally {
      setLoadingKey("");
    }
  };

  return (
    <Container className="mt-4">
      <h3>Notification Jobs</h3>
      <p className="text-muted">
        Run email notification jobs manually for testing: due reminders, overdue fines,
        and membership expiry reminders.
      </p>

      <div className="d-flex flex-column gap-3">

        {/* Due soon reminders */}
        <Card>
          <Card.Body>
            <Card.Title>Upcoming due reminders</Card.Title>
            <Card.Text>
              Sends reminder emails to students whose books are due in the next 2 days.
            </Card.Text>
            <Button
              variant="primary"
              disabled={loadingKey === "due"}
              onClick={() =>
                callJob("due", "/notifications/run-due-reminders")
              }
            >
              {loadingKey === "due" ? "Running..." : "Run due reminders"}
            </Button>
          </Card.Body>
        </Card>

        {/* Overdue fine reminders */}
        <Card>
          <Card.Body>
            <Card.Title>Overdue fine reminders</Card.Title>
            <Card.Text>
              Sends reminders for unpaid fines where dueDate is already past.
            </Card.Text>
            <Button
              variant="warning"
              disabled={loadingKey === "overdue"}
              onClick={() =>
                callJob("overdue", "/notifications/run-overdue-reminders")
              }
            >
              {loadingKey === "overdue" ? "Running..." : "Run overdue reminders"}
            </Button>
          </Card.Body>
        </Card>

        {/* Membership expiry reminders */}
        <Card>
          <Card.Body>
            <Card.Title>Membership expiry reminders</Card.Title>
            <Card.Text>
              Sends reminders to students whose membership expires within the next
              selected number of days.
            </Card.Text>
            <Form className="d-flex align-items-center gap-2 mb-2" style={{ maxWidth: 260 }}>
              <Form.Label className="mb-0">Days ahead:</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={daysAhead}
                onChange={(e) => setDaysAhead(Number(e.target.value) || 1)}
              />
            </Form>
            <Button
              variant="success"
              disabled={loadingKey === "membership"}
              onClick={() =>
                callJob("membership", "/notifications/run-membership-expiry", {
                  days: daysAhead,
                })
              }
            >
              {loadingKey === "membership" ? "Running..." : "Run membership reminders"}
            </Button>
          </Card.Body>
        </Card>
      </div>

      {status && <p className="mt-3 text-muted">{status}</p>}
    </Container>
  );
}
