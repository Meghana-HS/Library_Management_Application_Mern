import React, { useState } from "react";
import { Container, Row, Col, Button, Card, ListGroup, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/global.css";
import { Badge } from "react-bootstrap";
import { 
  FaCheckCircle, 
  FaSearch, 
  FaBookReader, 
  FaLaptop 
} from "react-icons/fa";




/**
 * LandingPage.jsx
 * Modern University Library - Full landing page component
 *
 * Notes:
 * - Hero is flush to top (no gap)
 * - Sidebar toggles via hamburger (floating, not pushing content)
 * - Uses stable Unsplash images (library/study related)
 * - Images have onError fallback to placeholder
 */

const heroImage =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80";

// Stable, library-specific images (Unsplash)
const IMAGES = {
  readingRoom: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
  bookshelves: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
  studyGroup: "https://images.unsplash.com/photo-1520975911150-44f6c6b26f3b?auto=format&fit=crop&w=1200&q=80",
  digitalLab: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  workshop: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
  gallery1: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
  gallery2: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80",
  gallery3: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  faculty: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  student1: "https://images.unsplash.com/photo-1545996124-65f9f6a8a7b8?auto=format&fit=crop&w=800&q=80",
  student2: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=800&q=80",
};

const featuredBooks = [
  {
    title: "Data Structures & Algorithms — 4th Ed.",
    img: IMAGES.bookshelves,
    desc: "Comprehensive coverage for CS students: theory, examples, and exercises.",
    tag: "Computer Science",
  },
  {
    title: "Advanced Database Systems",
    img: IMAGES.digitalLab,
    desc: "Distributed databases, transactions, and modern storage architectures.",
    tag: "Databases",
  },
  {
    title: "Principles of Networking",
    img: IMAGES.gallery1,
    desc: "Networking fundamentals with practical labs and experiment guides.",
    tag: "Networking",
  },
  {
    title: "Research Methods in CS",
    img: IMAGES.gallery2,
    desc: "From literature review to publication — structured research workflow.",
    tag: "Research",
  },
];

const galleryImgs = [IMAGES.gallery1, IMAGES.gallery2, IMAGES.gallery3, IMAGES.readingRoom];

const events = [
  {
    title: "Research Paper Writing Workshop",
    date: "Jan 12, 2026",
    time: "10:00 AM",
    img: IMAGES.workshop,
  },
  {
    title: "AI in Libraries: Tools & Use-cases",
    date: "Feb 02, 2026",
    time: "2:00 PM",
    img: IMAGES.digitalLab,
  },
  {
    title: "Citation Management (Zotero) — Hands-on",
    date: "Mar 05, 2026",
    time: "11:00 AM",
    img: IMAGES.readingRoom,
  },
];

const testimonials = [
  { name: "Dr. R. Mehta", role: "Professor — CS", text: "The library’s research support raised our publication quality.", img: IMAGES.faculty },
  { name: "Pooja", role: "M.Tech Student", text: "Found rare journals for my thesis via the library portal.", img: IMAGES.student1 },
  { name: "Kumar", role: "B.Tech Student", text: "Late night access + study pods = exam success!", img: IMAGES.student2 },
];

const resources = [
  { title: "IEEE Xplore", desc: "Papers & conference proceedings", link: "https://ieeexplore.ieee.org" },
  { title: "ACM Digital Library", desc: "Core computing research", link: "https://dl.acm.org" },
  { title: "ScienceDirect", desc: "Science & engineering journals", link: "https://www.sciencedirect.com" },
  { title: "Library eBooks Portal", desc: "Curated campus e-books", link: "#" },
];

// fallback image for onError
const FALLBACK = "https://via.placeholder.com/1200x800?text=Library+Image";

export default function LandingPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("hero"); // hero by default
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  

  const openSection = (name) => {
    setActive(name);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const subscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return alert("Please enter an email.");
    // placeholder — integrate API if needed
    alert(`Thanks — ${newsletterEmail} subscribed to library updates (demo).`);
    setNewsletterEmail("");
  };

  const Img = ({ src, alt, style }) => (
    <img
      src={src}
      alt={alt || "library"}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = FALLBACK;
      }}
      style={style}
    />
  );

  // Section components
  const AboutSection = (
  <section className="py-5 bg-light">
    <Container>

      {/* Heading */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">About the University Library</h2>
        <p className="mx-auto mt-3" style={{ maxWidth: 850 }}>
          Our library empowers students and researchers through curated knowledge,
          modern study spaces, advanced research tools, and 24/7 digital access.
          We bridge learning, innovation, and academic excellence.
        </p>

        <Badge bg="primary" className="px-4 py-2 mt-3 shadow-sm">
          Serving 10,000+ Students Every Semester
        </Badge>
      </div>

      {/* Main Info Section */}
      <Row className="g-4">
        {/* Left Card */}
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Our Mission & Services</Card.Title>
              <Card.Text>
                We are committed to providing a rich academic ecosystem that nurtures
                learning, exploration, and research excellence using a wide range of 
                services, expert support, and high-quality study facilities.
              </Card.Text>

              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex align-items-center">
                  <FaCheckCircle className="text-primary me-2" /> Interlibrary Loan & Special Collections
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                  <FaSearch className="text-primary me-2" /> Research Consultations & Citation Workshops
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                  <FaBookReader className="text-primary me-2" /> Course Reserves & Digital Reading Lists
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                  <FaLaptop className="text-primary me-2" /> Access to Online Databases & e-Resources
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Cards (Images + Additional info) */}
        <Col md={6}>
          <Row className="g-3">
            <Col md={6}>
              <Card className="shadow-sm border-0">
                <Img
                  src={IMAGES.readingRoom}
                  alt="Reading room"
                  style={{ width: "100%", height: 170, objectFit: "cover", borderRadius: 6 }}
                />
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm border-0">
                <Img
                  src={IMAGES.bookshelves}
                  alt="Bookshelves"
                  style={{ width: "100%", height: 170, objectFit: "cover", borderRadius: 6 }}
                />
              </Card>
            </Col>

            <Col md={12}>
              <Card className="p-3 mt-2 shadow-sm border-0">
                <Card.Title className="fw-bold">Facilities</Card.Title>
                <Card.Text>
                  Fully equipped study zones, digital labs, project discussion rooms,
                  printing/scanning services, and a dedicated 24/7 online support desk.
                </Card.Text>

                <Row className="text-center">
                  <Col xs={4}>
                    <small className="text-muted">Quiet Rooms</small>
                  </Col>
                  <Col xs={4}>
                    <small className="text-muted">Multimedia Lab</small>
                  </Col>
                  <Col xs={4}>
                    <small className="text-muted">Wi-Fi Enabled</small>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Stats */}
      <Row className="mt-5 g-3">
        {[
          { n: "120k+", t: "Books & Volumes", col: "primary" },
          { n: "15k+", t: "e-Journals & Databases", col: "success" },
          { n: "12+", t: "Workshops / Month", col: "warning" },
          { n: "24/7", t: "Digital Library Access", col: "danger" },
          { n: "50+", t: "Study Rooms", col: "info" },
        ].map((s, i) => (
          <Col md={3} sm={6} key={i}>
            <Card className="p-4 text-center shadow-sm border-0">
              <h3 className={`fw-bold text-${s.col}`}>{s.n}</h3>
              <small className="text-muted">{s.t}</small>
            </Card>
          </Col>
        ))}
      </Row>

    </Container>
  </section>
);


  const FeaturedSection = (
    <section className="py-5" style={{ background: "#f8f9fa" }}>
      <Container>
        <h2 className="text-center mb-4">Featured & Recommended</h2>
        <p className="text-center text-muted mb-4" style={{ maxWidth: 900, margin: "0 auto" }}>
          Faculty-recommended readings and core texts for coursework & research.
        </p>

        <Row className="g-4">
          {featuredBooks.map((b, idx) => (
            <Col md={3} sm={6} key={idx}>
              <Card className="h-100 shadow-sm">
                <Img src={b.img} alt={b.title} style={{ width: "100%", height: 220, objectFit: "cover" }} />
                <Card.Body>
                  <Card.Title>{b.title}</Card.Title>
                  <Card.Text style={{ fontSize: 13 }}>{b.desc}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">{b.tag}</small>
                    <Button size="sm" variant="outline-primary" onClick={() => alert("Open book details (demo)")}>
                      Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mt-4">
          <Col md={8}>
            <Card className="shadow-sm p-3">
              <h5>Faculty Picks — Spring 2026</h5>
              <p className="mb-0">Curated reading lists per course — check department pages or ask your librarian.</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm p-3 text-center">
              <h6>Reserve a Copy</h6>
              <p className="small">Reserve limited copies through your library account.</p>
              <Button onClick={() => alert("Reserve flow (demo)")}>Reserve Now</Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const GallerySection = (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-4">Gallery — Spaces & Collections</h2>
        <p className="text-center text-muted mb-4" style={{ maxWidth: 900, margin: "0 auto" }}>
          Photos of study spaces, archives, digital lab and community events.
        </p>

        <Row className="g-3">
          {galleryImgs.map((src, i) => (
            <Col md={6} sm={12} key={i}>
              <Card className="shadow-sm">
                <Img src={src} alt={`gallery-${i}`} style={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 6 }} />
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mt-4">
          <Col md={6}>
            <Card className="p-3 shadow-sm">
              <h5>Special Collections</h5>
              <p>Rare manuscripts and university publications — supervised access only.</p>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-3 shadow-sm">
              <h5>Study Rooms & Labs</h5>
              <p>Book collaborative rooms and multimedia labs via the portal for project work.</p>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const EventsSection = (
    <section className="py-5" style={{ background: "#f8f9fa" }}>
      <Container>
        <h2 className="text-center mb-4">Events & Workshops</h2>
        <p className="text-center text-muted mb-4" style={{ maxWidth: 900, margin: "0 auto" }}>
          Practical workshops to boost research skills, citation management and academic writing.
        </p>

        <Row className="g-4">
          {events.map((ev, i) => (
            <Col md={4} sm={6} key={i}>
              <Card className="h-100 shadow-sm">
                <Img src={ev.img} alt={ev.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                <Card.Body>
                  <Card.Title>{ev.title}</Card.Title>
                  <Card.Text className="small text-muted">{ev.date} • {ev.time}</Card.Text>
                  <Card.Text style={{ fontSize: 14 }}>Join engaging sessions with authors, experts and librarians.</Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button size="sm" onClick={() => alert("Register (demo)")}>Register</Button>
                    <small className="text-muted">Seats limited</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );

  const TestimonialsSection = (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-4">Community Testimonials</h2>
        <Row className="g-4 justify-content-center">
          {testimonials.map((t, i) => (
            <Col md={4} sm={6} key={i}>
              <Card className="h-100 shadow-sm p-3">
                <Row className="g-0 align-items-center">
                  <Col xs={3}>
                    <Img src={t.img} alt={t.name} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: "50%" }} />
                  </Col>
                  <Col xs={9}>
                    <Card.Body>
                      <Card.Text style={{ fontSize: 14 }}>"{t.text}"</Card.Text>
                      <Card.Subtitle className="text-muted">{t.name} — {t.role}</Card.Subtitle>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mt-4">
          <Col md={6}>
            <Card className="p-3 shadow-sm">
              <h5>Alumni Spotlight</h5>
              <p>Authors and alumni regularly contribute to events and collections.</p>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-3 shadow-sm">
              <h5>Student Feedback</h5>
              <p>We review feedback and update services and collections regularly.</p>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const ResourcesSection = (
    <section className="py-5" style={{ background: "#f8f9fa" }}>
      <Container>
        <h2 className="text-center mb-4">Digital Resources & Tools</h2>
        <p className="text-center text-muted mb-4" style={{ maxWidth: 900, margin: "0 auto" }}>
          Subscribed databases, citation tools, and e-books — available to members.
        </p>

        <Row className="g-4">
          {resources.map((r, i) => (
            <Col md={3} sm={6} key={i}>
              <Card className="h-100 shadow-sm p-3 text-center">
                <Card.Body>
                  <Card.Title>{r.title}</Card.Title>
                  <Card.Text style={{ fontSize: 14 }}>{r.desc}</Card.Text>
                  <Button size="sm" variant="outline-primary" onClick={() => window.open(r.link, "_blank")}>Visit</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mt-4">
          <Col md={6}>
            <Card className="p-3 shadow-sm">
              <h5>Remote Access</h5>
              <p>Use university credentials on the library portal to access subscribed databases off-campus.</p>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-3 shadow-sm">
              <h5>Research Help</h5>
              <p>Book 1:1 sessions with librarians for literature review and search strategies.</p>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const FAQSection = (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-4">Frequently Asked Questions</h2>
        <Row className="justify-content-center">
          <Col md={8}>
            {[
              { q: "How do I become a member?", a: "Register with university credentials. Students get instant access." },
              { q: "Opening hours?", a: "Mon–Sat: 8:00 AM – 10:00 PM. Digital resources 24/7." },
              { q: "Request a book?", a: "Use 'Request New Title' on the portal or contact the helpdesk." },
            ].map((f, i) => (
              <Card key={i} className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title style={{ fontSize: 16 }}>{f.q}</Card.Title>
                  <Card.Text className="text-muted">{f.a}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
    </section>
  );

  // Footer (no quick links)
  const Footer = (
    <footer style={{ background: "#0b1220", color: "#cbd5e1" }} className="pt-5 pb-4 mt-4">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <h5 style={{ color: "#fff" }}>University Library</h5>
            <p>Supporting learning & research across campus. Visit us for collections, events and research help.</p>
          </Col>

          <Col md={4}>
            <h6 style={{ color: "#fff" }}>Contact</h6>
            <p className="mb-1"><strong>Email:</strong> libsupport@university.edu</p>
            <p className="mb-1"><strong>Phone:</strong> +91 98765 43210</p>
            <p className="mb-0"><strong>Address:</strong> Library Building, University Campus</p>
          </Col>

          <Col md={4}>
            <h6 style={{ color: "#fff" }}>Newsletter</h6>
            <p className="mb-2">Subscribe for events, new arrivals and research tips.</p>
            <Form onSubmit={subscribe} className="d-flex gap-2">
              <Form.Control
                type="email"
                placeholder="you@university.edu"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary">Subscribe</Button>
            </Form>
          </Col>
        </Row>

        <hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "20px 0" }} />
        <Row>
          <Col className="text-center small">© {new Date().getFullYear()} University Library. All rights reserved.</Col>
        </Row>
      </Container>
    </footer>
  );

  // Decide which section to render
  const sectionMap = {
    about: AboutSection,
    featured: FeaturedSection,
    gallery: GallerySection,
    events: EventsSection,
    testimonials: TestimonialsSection,
    resources: ResourcesSection,
    faq: FAQSection,
  };

  // main hero markup (flush to top)
  const Hero = (
    <section
  className="d-flex align-items-center justify-content-center text-center text-white position-relative"
  style={{
    backgroundImage: `url(${heroImage})`,
    height: "100vh",
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div
    className="position-absolute w-100 h-100"
    style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
  ></div>

  <Container
    fluid
    className="position-relative d-flex flex-column justify-content-center align-items-center"
    style={{ zIndex: 2 }}
  >
    <h1 className="display-3 fw-bold hero-text">Welcome to Our Library</h1>
    <p className="lead hero-text">
      Discover, Learn, and Grow with our amazing collection.
    </p>

    <div className="d-flex justify-content-center mt-4 gap-3">
      <Button variant="primary" size="lg" onClick={() => navigate("/login")}>
        Login
      </Button>

      <Button variant="outline-light" size="lg" onClick={() => navigate("/register")}>
        Register
      </Button>
    </div>
  </Container>
</section>

  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar (sliding) */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : -260,
          width: 260,
          height: "100vh",
          background: "linear-gradient(180deg,#132235,#0b2b3a)",
          color: "#fff",
          padding: 20,
          transition: "left 300ms ease",
          zIndex: 1600,
          boxShadow: "2px 0 20px rgba(0,0,0,0.25)",
        }}
        aria-label="Library sidebar"
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: "#fff", color: "#0b2b3a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
            UL
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>University Library</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Knowledge • Research • Community</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {[
            { key: "about", label: "About" },
            { key: "featured", label: "Featured Books" },
            { key: "gallery", label: "Gallery" },
            { key: "events", label: "Events" },
            { key: "testimonials", label: "Testimonials" },
            { key: "resources", label: "Resources" },
            { key: "faq", label: "FAQ" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => openSection(item.key)}
              style={{
                background: "transparent",
                color: "#fff",
                border: "none",
                textAlign: "left",
                padding: "10px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: active === item.key ? 700 : 500,
                boxShadow: active === item.key ? "inset 0 0 0 2px rgba(255,255,255,0.03)" : "none",
                transition: "background 160ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "auto" }}>
          <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <small style={{ color: "rgba(255,255,255,0.8)" }}>Not signed in</small>
            <Button size="sm" variant="light" onClick={() => navigate("/login")}>Login</Button>
          </div>
        </div>
      </aside>

      {/* Floating hamburger */}
      <button
        aria-label="Toggle menu"
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1800,
          width: 48,
          height: 48,
          borderRadius: 10,
          background: "#0b2b3a",
          color: "#fff",
          border: "none",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        ☰
      </button>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 0 }}>
        {/* Render hero or selected section */}
        {active === "hero" ? (
          <>
            {Hero}

            {/* Home panels below hero */}
            <section className="py-5" style={{ background: "#f4f6f8" }}>
              <Container>
                <Row className="g-4 align-items-center">
                  <Col md={6}>
                    <h2>Join the Library</h2>
                    <p>
                      Register with your university credentials for full access to loans, digital subscriptions, and research support.
                    </p>
                    <ListGroup>
                      <ListGroup.Item>Borrow up to 6 books</ListGroup.Item>
                      <ListGroup.Item>Remote database access</ListGroup.Item>
                      <ListGroup.Item>Priority seating during exams</ListGroup.Item>
                    </ListGroup>
                    <div className="mt-3">
                      <Button variant="success" onClick={() => navigate("/register")}>Register Now</Button>
                    </div>
                  </Col>

                  <Col md={6}>
                    <Card className="shadow-sm p-3">
                      <h5>Contact & Helpdesk</h5>
                      <p className="mb-1"><strong>Email:</strong> libsupport@university.edu</p>
                      <p className="mb-1"><strong>Phone:</strong> +91 98765 43210</p>
                      <p className="mb-0"><strong>Helpdesk Hours:</strong> Mon–Sat • 9:00 AM – 6:00 PM</p>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </section>

            {/* Footer */}
            {Footer}
          </>
        ) : (
          // render selected section
          sectionMap[active] || <div className="p-5"><Container><h3>Section not found</h3></Container></div>
        )}
      </main>
    </div>
  );
}
