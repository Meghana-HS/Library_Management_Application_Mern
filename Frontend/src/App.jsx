// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Landing
import LandingPage from "./pages/landing/LandingPage";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin – Dashboard & Others
import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingApprovals from "./pages/admin/PendingApprovals";
import ManageUsers from "./pages/admin/ManageUsers";
import ReportStats from "./pages/admin/ReportStats";

// Admin – Membership & Fines
import MembershipList from "./pages/admin/membership/MembershipList";
import AddMembership from "./pages/admin/membership/AddMembership";
import EditMembership from "./pages/admin/membership/EditMembership";
import FinesList from "./pages/admin/fines/FinesList";
import AdminMembershipRequests from "./pages/admin/membership/AdminMembershipRequests";
import AdminEmailJobs from "./pages/admin/AdminEmailJobs";
import AdminNotifications from "./pages/admin/AdminNotifications";

// Librarian
import LibrarianDashboard from "./pages/librarian/LibrarianDashboard";
import AddBook from "./pages/librarian/AddBook";
import ManageBooks from "./pages/librarian/ManageBooks";
import IssueBook from "./pages/librarian/IssueBook";
import ReturnBook from "./pages/librarian/ReturnBook";
import EditBook from "./pages/librarian/EditBook";
import BookRequests from "./pages/librarian/BookRequests";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import SearchBooks from "./pages/student/SearchBooks";
import BookDetails from "./pages/student/BookDetails";
import MyBorrowedBooks from "./pages/student/MyBorrowedBooks";
import Profile from "./pages/student/Profile";
import MyRequests from "./pages/student/MyRequests";
import StudentMembershipPage from "./pages/student/StudentMembershipPage";
import MyFines from "./pages/student/MyFines";
import RecommendedBooks from "./pages/student/RecommendedBooks";
import Report from "./pages/student/Report"; // ← your StudentReportStats dashboard

export default function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<ReportStats />} />
        <Route path="pending" element={<PendingApprovals />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="reports" element={<ReportStats />} />
        <Route path="memberships/list" element={<MembershipList />} />
        <Route path="memberships/add" element={<AddMembership />} />
        <Route path="memberships/edit/:id" element={<EditMembership />} />
        <Route
          path="membership-requests"
          element={<AdminMembershipRequests />}
        />
        <Route path="fines" element={<FinesList />} />
        <Route path="email-jobs" element={<AdminEmailJobs />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>

      {/* LIBRARIAN ROUTES */}
      <Route
        path="/librarian"
        element={
          <ProtectedRoute role="LIBRARIAN">
            <LibrarianDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="add-book" element={<AddBook />} />
        <Route path="manage-books" element={<ManageBooks />} />
        <Route path="edit-book/:id" element={<EditBook />} />
        <Route path="issue" element={<IssueBook />} />
        <Route path="return" element={<ReturnBook />} />
        <Route path="requests" element={<BookRequests />} />
      </Route>

      {/* STUDENT ROUTES */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        {/* optional: make Report the default dashboard */}
        {/* <Route index element={<Report />} /> */}

        <Route path="report" element={<Report />} />
        <Route path="search" element={<SearchBooks />} />
        <Route path="recommendations" element={<RecommendedBooks />} />
        <Route path="book/:id" element={<BookDetails />} />
        <Route path="my" element={<MyBorrowedBooks />} />
        <Route path="requests" element={<MyRequests />} />
        <Route path="profile" element={<Profile />} />
        <Route path="membership" element={<StudentMembershipPage />} />
        <Route path="fines" element={<MyFines />} />
      </Route>
    </Routes>
  );
}
