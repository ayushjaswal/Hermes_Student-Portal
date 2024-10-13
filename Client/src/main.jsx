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
import { Edit } from "lucide-react";

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
    path: "/courses/:courseId",
    element: (
      <ProtectedRoute>
        <CoursePage />
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
