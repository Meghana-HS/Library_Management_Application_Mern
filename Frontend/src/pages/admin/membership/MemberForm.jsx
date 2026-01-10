// Frontend/pages/admin/memberships/MemberForm.jsx
import React, { useEffect, useState } from "react";
import { Form, Row, Col, Spinner, Button } from "react-bootstrap";
import { request } from "../../../services/api";

export default function MemberForm({ initial, onSubmit, submitting }) {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    address: initial?.address || "",
    planId: initial?.plan?._id || "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await request("/membership-plans");
        console.log("plans from API >>>", data);
        setPlans(data.filter(p => p.isActive));
      } catch (e) {
        console.error("Failed to load plans >>>", e);
      } finally {
        setLoadingPlans(false);
      }
    }
    load();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="name">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="email">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="plan">
            <Form.Label>Membership plan *</Form.Label>
            {loadingPlans ? (
              <div className="d-flex align-items-center">
                <Spinner size="sm" className="me-2" />
                <span>Loading plans...</span>
              </div>
            ) : (
              <Form.Select
                name="planId"
                value={form.planId}
                onChange={handleChange}
                required
              >
                <option value="">Select a plan</option>
                {plans.map(plan => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name} – ₹{plan.fee} / {plan.durationInDays} days
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end mt-3">
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          style={{ borderRadius: "999px", paddingInline: "24px" }}
        >
          {submitting ? "Saving..." : "Save member"}
        </Button>
      </div>
    </Form>
  );
}
