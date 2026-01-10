import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Spinner } from "react-bootstrap";
import { request } from "../../../services/api";
import MemberForm from "./MemberForm";

export default function EditMembership() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await request(`/members/${id}`);
        setMember(data);
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async values => {
    try {
      setSubmitting(true);
      await request(`/members/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          address: values.address,
          planId: values.planId,
        }),
      });
      navigate("/admin/memberships/list");
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <Card.Title>Edit Member</Card.Title>
          <MemberForm initial={member} onSubmit={handleSubmit} submitting={submitting} />
        </Card.Body>
      </Card>
    </Container>
  );
}
