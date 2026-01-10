import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUsers, FaUserCheck, FaChartBar } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const userStats = [
  { name: 'Active Students', value: 80 },
  { name: 'Inactive Students', value: 40 },
  { name: 'Pending Approvals', value: 5 },
];

const activityStats = [
  { month: 'Jan', users: 20 },
  { month: 'Feb', users: 35 },
  { month: 'Mar', users: 50 },
  { month: 'Apr', users: 40 },
  { month: 'May', users: 60 },
];

const COLORS = ['#4dabf7', '#ff6b6b', '#51cf66'];

export default function ReportStats() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #f0f4f8, #d9e2ec)',
        paddingTop: '60px',
        paddingBottom: '60px',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Container>
        <h1
          className="text-center mb-5"
          style={{ fontSize: '2.5rem', fontWeight: '700', color: '#34495e' }}
        >
          Reports & Statistics
        </h1>

        {/* Top Stats Cards */}
        <Row className="mb-5 g-4">
          <Col md={4}>
            <Card className="shadow-sm rounded-4 py-4 text-center">
              <FaUsers size={40} className="mb-2" color="#4dabf7" />
              <h2>120</h2>
              <p style={{ fontWeight: '500' }}>Total Users</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm rounded-4 py-4 text-center">
              <FaUserCheck size={40} className="mb-2" color="#ff6b6b" />
              <h2>5</h2>
              <p style={{ fontWeight: '500' }}>Pending Approvals</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm rounded-4 py-4 text-center">
              <FaChartBar size={40} className="mb-2" color="#51cf66" />
              <h2>80</h2>
              <p style={{ fontWeight: '500' }}>Active Students</p>
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="g-4">
          <Col md={6}>
            <Card className="shadow-sm rounded-4 p-4">
              <h5 className="text-center mb-3">User Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {userStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm rounded-4 p-4">
              <h5 className="text-center mb-3">Monthly Activity</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityStats}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#4dabf7" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
