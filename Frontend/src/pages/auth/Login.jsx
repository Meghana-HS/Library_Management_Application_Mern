import React, { useEffect, useState } from "react";
import { request } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBook } from "react-icons/fa";

// put your real client id here or use import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID =
  "220198953234-dcp3g2t2nk2aa20ksv5brdv49hos442l.apps.googleusercontent.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  // normal email/password login
  const handle = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const { token, role, name, email: em } = res;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ role, name, email: em }));
      if (role === "ADMIN") navigate("/admin");
      else if (role === "LIBRARIAN") navigate("/librarian");
      else navigate("/student");
    } catch (err) {
      setErr(err.message || "Login failed");
    }
  };

  // handle response from Google (register or login)
  const handleGoogleCredential = async (credential) => {
    try {
      setErr("");
      // backend: POST /api/auth/google  (request() already prefixes /api)
      const res = await request("/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken: credential }),
      });

      const { token, role, name, email: em, isNewUser } = res;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ role, name, email: em }));

      // optional: show different message based on isNewUser
      console.log(isNewUser ? "Registered with Google" : "Logged in with Google");

      if (role === "ADMIN") navigate("/admin");
      else if (role === "LIBRARIAN") navigate("/librarian");
      else navigate("/student");
    } catch (error) {
      console.error(error);
      setErr(error.message || "Google login failed");
    }
  };

  // load Google script and render button
  useEffect(() => {
    /* global google */
    // inject script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            // response.credential is the ID token
            handleGoogleCredential(response.credential);
          },
        });

        // render the button into our div
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
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
          "url(https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1600&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        position: "relative",
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
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.95)",
          zIndex: 2,
        }}
      >
        <div className="text-center mb-4">
          <FaBook size={50} style={{ color: "#2575fc" }} />
          <h2 className="mt-2 fw-bold">Welcome Back!</h2>
          <p className="text-muted">Login to your library account</p>
        </div>

        {err && <Alert variant="danger">{err}</Alert>}

        <Form onSubmit={handle}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow-sm"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow-sm"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 fw-bold mb-3"
            style={{ backgroundColor: "#2575fc", borderColor: "#2575fc" }}
          >
            Login
          </Button>
        </Form>

        {/* Google Login */}
        <div className="text-center mb-3">
          <small className="text-muted">or</small>
        </div>
        <div id="googleSignInDiv" className="d-flex justify-content-center" />

        <div className="mt-3 text-center">
          <small className="text-muted">
            Don't have an account?{" "}
            <Button variant="link" onClick={() => navigate("/register")}>
              Register
            </Button>
          </small>
        </div>
      </Card>
    </div>
  );
}
