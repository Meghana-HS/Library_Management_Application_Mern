import React, { useEffect, useState } from "react";
import { request } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserPlus } from "react-icons/fa";

// Same client id as on Login page
const GOOGLE_CLIENT_ID =
  "220198953234-dcp3g2t2nk2aa20ksv5brdv49hos442l.apps.googleusercontent.com";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("password", password);
      fd.append("role", role);
      if (file) fd.append("idProof", file);

      const res = await request("/auth/register", {
        method: "POST",
        body: fd,
      });
      setMsg(res.message || "Registered successfully");
    } catch (err) {
      setMsg(err.message || "Error");
    }
  };

  // Handle Google register/login via backend /auth/google
  const handleGoogleCredential = async (credential) => {
    try {
      setMsg("");
      const res = await request("/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken: credential }),
      });

      const { token, role, name, email: em, isNewUser } = res;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ role, name, email: em }));

      setMsg(
        isNewUser
          ? "Registered with Google successfully!"
          : "Logged in with Google!"
      );

      if (role === "ADMIN") navigate("/admin");
      else if (role === "LIBRARIAN") navigate("/librarian");
      else navigate("/student");
    } catch (error) {
      console.error(error);
      setMsg(error.message || "Google registration/login failed");
    }
  };

  // Load Google script and render button
  useEffect(() => {
    /* global google */
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            handleGoogleCredential(response.credential);
          },
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleRegisterDiv"),
          {
            theme: "outline",
            size: "large",
            width: "100",
          }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url(https://hips.hearstapps.com/hmg-prod/images/marieflaniganht24-ph-julie-soefer-7367-230922-flanigan-lo-res-663e840cdf0df.jpg?crop=0.9080660835762876xw%3A1xh%3Bcenter%2Ctop&resize=1200%3A%2A)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        padding: "20px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />

      <Card
        className="p-4 shadow-lg rounded-4"
        style={{
          maxWidth: "450px",
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.95)",
          zIndex: 2,
        }}
      >
        <div className="text-center mb-4">
          <FaUserPlus size={50} style={{ color: "#0077cc" }} />
          <h2 className="mt-2 fw-bold">Create Account</h2>
          <p className="text-muted">Register to access the library</p>
        </div>

        {msg && (
          <Alert
            variant={
              msg.toLowerCase().includes("success") ||
              msg.toLowerCase().includes("logged in")
                ? "success"
                : "danger"
            }
          >
            {msg}
          </Alert>
        )}

        <Form onSubmit={submit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="STUDENT">Student</option>
              <option value="LIBRARIAN">Librarian</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formFile">
            <Form.Label>ID Proof (optional)</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 fw-bold mb-3"
          >
            Register
          </Button>
        </Form>

        {/* Google Register/Login */}
        <div className="text-center mb-3">
          <small className="text-muted">or</small>
        </div>
        <div
          id="googleRegisterDiv"
          className="d-flex justify-content-center"
        />

        <div className="mt-3 text-center">
          <small className="text-muted">
            Already have an account?{" "}
            <Button variant="link" onClick={() => navigate("/login")}>
              Login
            </Button>
          </small>
        </div>
      </Card>
    </div>
  );
}
