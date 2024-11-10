import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import Login from "./Pages/Login.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import ProtectedRoute from "./components/AppComponents/ProtectedRoute.jsx";
import Courses from "./Pages/Courses.jsx";
import Profile from "./Pages/Profile.jsx";
import ChangePassword from "./Pages/ChangePassword.jsx";
import Classroom from "./Pages/Classroom.jsx";
import Assignment from "./Pages/Assignments.jsx";
import CoursePage from "./Pages/CoursePage.jsx";
import EditProfile from "./Pages/EditProfile.jsx";
import ForumPage from "./Pages/ForumPage.jsx";
import FacultyClassroom from "./Pages/FacultyClassroom.jsx";
import FacultyClassrooms from "./Pages/FacultyClassrooms.jsx";
import FacultyProfile from "./Pages/FacultyProfile.jsx";
import FacultyProfileEdit from "./Pages/FacultyProfileEdit.jsx";
import FacultyAssignments from "./Pages/FacultyAssignments.jsx";
import FacultyContact from "./Pages/FacultyContact.jsx";
import FacultyAssignmentSubmission from "./Pages/FacultyAssignmentSubmission.jsx";
import AssignmentPage from "./Pages/AssignmentPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/courses",
    element: (
      <ProtectedRoute>
        <Courses />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/classroom",
    element: (
      <ProtectedRoute>
        <Classroom />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assignments",
    element: (
      <ProtectedRoute>
        <Assignment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/edit",
    element: (
      <ProtectedRoute>
        <EditProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forum",
    element: (
      <ProtectedRoute>
        <ForumPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/courses/:courseId",
    element: (
      <ProtectedRoute>
        <CoursePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faculty-classroom",
    element: (
      <ProtectedRoute>
        <FacultyClassrooms />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faculty-classroom/:classroomId",
    element: (
      <ProtectedRoute>
        <FacultyClassroom />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faculty-profile",
    element: (
      <ProtectedRoute>
        <FacultyProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faculty-profile/edit",
    element: (
      <ProtectedRoute>
        <FacultyProfileEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faculty-assignments",
    element: (
      <ProtectedRoute>
        <FacultyAssignments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forum-messages",
    element: (
      <ProtectedRoute>
        <FacultyContact />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faculty-assignments-submissions/:assignmentId",
    element: (
      <ProtectedRoute>
        <FacultyAssignmentSubmission />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assignments/:assignmentId",
    element: (
      <ProtectedRoute>
        <AssignmentPage />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
