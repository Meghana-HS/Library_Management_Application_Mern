// src/pages/student/RecommendedBooks.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Badge, Button } from "react-bootstrap";
import { FaBookOpen } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { request } from "../../services/api";

export default function RecommendedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await request("/recommendations/for-user");
      setBooks(data || []);
    } catch (err) {
      console.error("Error loading recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const topBooks = books.slice(0, 6);

  return (
    <div
      style={{
        minHeight: "75vh",
        padding: "8px 0 12px",
        background:
          "radial-gradient(circle at top left, #e0f2fe 0, transparent 40%), radial-gradient(circle at bottom right, #e9d5ff 0, transparent 45%)",
        borderRadius: 24,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.96)",
          borderRadius: 24,
          padding: "24px 26px 26px",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.15)",
        }}
      >
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <div className="d-flex align-items-start">
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "999px",
                background:
                  "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                marginRight: 14,
                boxShadow: "0 10px 24px rgba(79, 70, 229, 0.5)",
              }}
            >
              <FaBookOpen size={26} />
            </div>
            <div>
              <h2
                className="mb-1"
                style={{ fontWeight: 750, color: "#0f172a", fontSize: "1.6rem" }}
              >
                Recommended reads for you
              </h2>
              <p
                className="mb-2 text-muted"
                style={{ fontSize: "1rem", maxWidth: 600 }}
              >
                Curated suggestions based on your recent activity and what
                similar students are borrowing from the library.
              </p>
              {books.length > 0 && (
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: "#eef2ff",
                    color: "#3730a3",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    padding: "6px 10px",
                  }}
                >
                  {books.length} personalized suggestions available
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 mt-md-0">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={load}
              style={{
                borderRadius: 999,
                fontSize: "0.9rem",
                padding: "7px 14px",
              }}
            >
              Refresh suggestions <FaArrowRight className="ms-1" size={12} />
            </Button>
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "45vh" }}
          >
            <Spinner animation="border" size="md" className="me-3" />
            <span className="text-muted" style={{ fontSize: "1rem" }}>
              Finding the best books for you...
            </span>
          </div>
        ) : !books.length ? (
          <div
            className="d-flex flex-column align-items-center justify-content-center text-center"
            style={{ minHeight: "45vh" }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                backgroundColor: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <FaBookOpen size={34} className="text-primary" />
            </div>
            <h4 className="mb-2" style={{ fontWeight: 650 }}>
              No recommendations yet
            </h4>
            <p
              className="text-muted mb-3"
              style={{ fontSize: "0.98rem", maxWidth: 460 }}
            >
              Once you start searching, requesting, and borrowing more books,
              this page will fill up with titles you are likely to enjoy.
            </p>
            <Button
              variant="primary"
              size="sm"
              style={{
                borderRadius: 999,
                fontSize: "0.9rem",
                padding: "7px 16px",
              }}
            >
              Go to Search
            </Button>
          </div>
        ) : (
          <>
            {/* OPTIONAL: small stats text */}
            <p
              className="text-muted mb-3"
              style={{ fontSize: "0.9rem" }}
            >
              Showing top {topBooks.length} of {books.length} suggestions.
            </p>

            {/* Larger cards: 2 per row on desktop */}
            <Row className="g-4">
              {topBooks.map(b => (
                <Col key={b._id} xs={12} md={6}>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: 18,
                      padding: "16px 18px 14px",
                      height: "100%",
                      boxShadow: "0 10px 26px rgba(15,23,42,0.12)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition:
                        "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
                    }}
                    className="hover-card"
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          color: "#111827",
                          marginBottom: 4,
                        }}
                      >
                        {b.title}
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.92rem", marginBottom: 6 }}
                      >
                        {b.author || "Unknown author"}
                      </div>

                      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                        {b.category && (
                          <Badge
                            bg="light"
                            text="dark"
                            style={{ fontSize: "0.8rem" }}
                          >
                            {b.category}
                          </Badge>
                        )}
                        <Badge
                          bg={
                            b.availableCopies > 0 ? "success" : "secondary"
                          }
                          style={{ fontSize: "0.8rem" }}
                        >
                          {b.availableCopies > 0
                            ? `${b.availableCopies} available`
                            : "Not available"}
                        </Badge>
                      </div>

                      {/* extra info text */}
                      <p
                        className="text-muted mb-1"
                        style={{ fontSize: "0.85rem", lineHeight: 1.5 }}
                      >
                        Popular among students who borrowed books similar to
                        yours. Great to explore if you liked your recent
                        reads.
                      </p>

                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Suggested because of your interest in this subject area.
                      </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Smart library recommendation
                      </span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>

      <style>{`
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(15,23,42,0.22);
          background-color: #fefefe;
        }
      `}</style>
    </div>
  );
}
