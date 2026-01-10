// src/pages/student/StudentMembershipPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { request } from "../../services/api";

export default function StudentMembershipPage() {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [myRequests, setMyRequests] = useState([]);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // load plans
        const data = await request("/membership-plans");
        setPlans(data.filter(p => p.isActive));

        // load my membership requests
        const reqs = await request("/membership-requests/mine");
        setMyRequests(reqs);

        const active = reqs.find(r =>
          ["pending", "approved"].includes(r.status)
        );
        if (active) {
          setHasActiveRequest(true);
          if (active.plan?._id) {
            setSelectedPlanId(active.plan._id);
          }
          setMessage(
            active.status === "pending"
              ? "You already have a pending membership request."
              : "You already have an active membership."
          );
        }
      } catch (e) {
        setMessage(e.message || "Failed to load membership plans");
      } finally {
        setLoadingPlans(false);
      }
    }
    loadData();
  }, []);

  async function handleRequest() {
    if (hasActiveRequest) {
      return;
    }
    if (!selectedPlanId) {
      setMessage("Please select a membership plan first.");
      return;
    }
    setMessage("");
    try {
      setSubmitting(true);
      await request("/membership-requests", {
        method: "POST",
        body: JSON.stringify({ planId: selectedPlanId }),
      });
      setMessage("Your membership request has been sent to the admin.");
      setHasActiveRequest(true);
    } catch (e) {
      setMessage(e.message || "Failed to send membership request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, #e0f2ff 0, #f5f9ff 45%, #eef2ff 100%)",
        padding: "32px 0",
      }}
    >
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 style={{ fontWeight: 700, color: "#111827" }}>
              Membership plans
            </h2>
            <p className="text-muted mb-0">
              Choose a plan and send a request to the admin to activate your
              membership.
            </p>
          </Col>
        </Row>

        {message && (
          <Row className="mb-3">
            <Col>
              <Alert
                variant={
                  message.toLowerCase().includes("failed") ? "warning" : "success"
                }
                className="mb-0"
              >
                {message}
              </Alert>
            </Col>
          </Row>
        )}

        {loadingPlans ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: 200 }}
          >
            <Spinner animation="border" className="me-2" />
            <span>Loading membership plans...</span>
          </div>
        ) : plans.length === 0 ? (
          <p className="text-muted">
            No membership plans are available right now.
          </p>
        ) : (
          <>
            <Row className="g-4">
              {plans.map(plan => {
                const selected = selectedPlanId === plan._id;
                return (
                  <Col key={plan._id} md={4}>
                    <Card
                      className="h-100 shadow-sm border-0"
                      style={{
                        borderRadius: 18,
                        overflow: "hidden",
                        border: selected
                          ? "2px solid #2563eb"
                          : "1px solid #e5e7eb",
                        transition:
                          "transform 0.15s ease, box-shadow 0.15s ease",
                      }}
                      onClick={() => {
                        if (!hasActiveRequest && selectedPlanId !== plan._id) {
                          setSelectedPlanId(plan._id);
                        }
                      }}
                    >
                      <Card.Body style={{ padding: "18px 18px 16px" }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h5
                            className="mb-0"
                            style={{ fontWeight: 600, color: "#111827" }}
                          >
                            {plan.name}
                          </h5>
                          {selected && (
                            <Badge bg="primary" pill>
                              Selected
                            </Badge>
                          )}
                        </div>
                        <p
                          className="text-muted mb-2"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {plan.description || "No description provided."}
                        </p>
                        <div className="d-flex align-items-baseline gap-1 mb-1">
                          <span
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: 700,
                              color: "#2563eb",
                            }}
                          >
                            ₹{plan.fee}
                          </span>
                          <span
                            className="text-muted"
                            style={{ fontSize: "0.85rem" }}
                          >
                            / {plan.durationInDays} days
                          </span>
                        </div>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "0.8rem" }}
                        >
                          Up to <strong>{plan.maxBooksAllowed}</strong> books at
                          a time.
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {selectedPlanId && (
              <Row className="mt-3">
                <Col lg={8}>
                  <Card
                    className="shadow-sm border-0"
                    style={{ borderRadius: 16, backgroundColor: "#f9fafb" }}
                  >
                    <Card.Body style={{ padding: "14px 16px" }}>
                      <h6
                        className="mb-1"
                        style={{ fontWeight: 600, color: "#111827" }}
                      >
                        Selected plan
                      </h6>
                      {(() => {
                        const selectedPlan = plans.find(
                          p => p._id === selectedPlanId
                        );
                        if (!selectedPlan)
                          return (
                            <p className="text-muted mb-0">
                              No plan found for selection.
                            </p>
                          );
                        return (
                          <>
                            <p className="mb-1" style={{ fontWeight: 500 }}>
                              {selectedPlan.name} – ₹{selectedPlan.fee} /{" "}
                              {selectedPlan.durationInDays} days
                            </p>
                            <p
                              className="text-muted mb-0"
                              style={{ fontSize: "0.85rem" }}
                            >
                              Up to{" "}
                              <strong>
                                {selectedPlan.maxBooksAllowed}
                              </strong>{" "}
                              books at a time.
                            </p>
                          </>
                        );
                      })()}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            <Row className="mt-4">
              <Col className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  size="lg"
                  disabled={
                    submitting || !selectedPlanId || hasActiveRequest
                  }
                  onClick={handleRequest}
                  style={{
                    borderRadius: 999,
                    paddingInline: 28,
                    fontWeight: 600,
                  }}
                >
                  {hasActiveRequest
                    ? "Request already submitted"
                    : submitting
                    ? "Sending request..."
                    : "Request membership"}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}
