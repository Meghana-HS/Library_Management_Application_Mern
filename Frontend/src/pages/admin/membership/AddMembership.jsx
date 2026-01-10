// Frontend/pages/admin/memberships/AddMembership.jsx
import React, { useState } from "react";
import { Container, Card, Button, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { request } from "../../../services/api";
import MemberForm from "./MemberForm";
import { FaUserPlus } from "react-icons/fa";

export default function AddMembership() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async values => {
    try {
      setSubmitting(true);
      await request("/members", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          // CHANGE HERE: backend expects 'plan' (ObjectId of MembershipPlan)
          plan: values.planId,
        }),
      });
      navigate("/admin/memberships/list");
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, #e0ecff 0, #f7fbff 40%, #eef4ff 100%)",
        padding: "32px 0",
      }}
    >
      <Container>
        <Row className="mb-4">
          <Col md={8}>
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(145deg, #2563eb, #3b82f6, #60a5fa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 22px rgba(37,99,235,0.35)",
                  color: "#fff",
                }}
              >
                <FaUserPlus size={24} />
              </div>
              <div>
                <h2
                  className="mb-1"
                  style={{ fontWeight: 700, color: "#102a43" }}
                >
                  Create membership
                </h2>
                <p className="text-muted mb-0">
                  Enter member details and select a membership plan.
                </p>
              </div>
            </div>
          </Col>
          <Col
            md={4}
            className="d-flex justify-content-md-end align-items-start mt-3 mt-md-0"
          >
            <Button
              variant="outline-secondary"
              onClick={() => navigate(-1)}
              style={{
                borderRadius: "999px",
                paddingInline: "18px",
                fontWeight: 500,
              }}
            >
              ← Back to list
            </Button>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={8}>
            <Card
              className="shadow-sm border-0"
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                backgroundColor: "#ffffff",
              }}
            >
              <Card.Body style={{ padding: "24px 24px 18px" }}>
                <h5
                  className="mb-2"
                  style={{ fontWeight: 600, color: "#183b56" }}
                >
                  Member information
                </h5>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Start with basic contact details and then choose a membership
                  plan inside the form. Fields marked with * are required.
                </p>
                <hr />
                <MemberForm
                  initial={null}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card
              className="border-0 shadow-sm mb-3"
              style={{
                borderRadius: "18px",
                background:
                  "linear-gradient(145deg, #1d4ed8, #2563eb, #38bdf8)",
                color: "#fff",
              }}
            >
              <Card.Body style={{ padding: "18px 18px 16px" }}>
                <h6 className="mb-2" style={{ fontWeight: 600 }}>
                  About membership plans
                </h6>
                <ul
                  style={{
                    listStyle: "none",
                    paddingLeft: 0,
                    marginBottom: 10,
                    fontSize: "0.86rem",
                  }}
                >
                  <li>• Each plan controls how many books can be borrowed.</li>
                  <li>• Expiry date is calculated from the plan duration.</li>
                  <li>• Fines and grace periods depend on the plan rules.</li>
                </ul>
                <hr
                  style={{
                    borderColor: "rgba(255,255,255,0.25)",
                    marginBlock: 10,
                  }}
                />
                <p
                  style={{
                    fontSize: "0.8rem",
                    marginBottom: 0,
                    opacity: 0.9,
                  }}
                >
                  You can always change the plan later from the membership
                  details page. Previous borrow history and fines are preserved.
                </p>
              </Card.Body>
            </Card>

            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: "18px", backgroundColor: "#ffffff" }}
            >
              <Card.Body style={{ padding: "14px 16px 12px" }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Selected plan
                  </span>
                  <Badge bg="info" pill>
                    Preview
                  </Badge>
                </div>
                <p
                  className="text-muted mb-1"
                  style={{ fontSize: "0.82rem" }}
                >
                  After you choose a plan in the form, its key details will show
                  here.
                </p>
                <div
                  style={{
                    marginTop: 6,
                    padding: "10px 12px",
                    borderRadius: "12px",
                    backgroundColor: "#f3f4ff",
                    border: "1px dashed #c7d2fe",
                    fontSize: "0.8rem",
                    color: "#4b5563",
                  }}
                >
                  No plan selected yet.
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
