/**
 * submissionRoutes.js
 *
 * This file is a component of the Submission module. It defines the routes responsible for submission of assignments.
 *
 *
 */

import express from "express";
import {
  fetchAssignments,
  createAssignment,
  fetchAssignmentById,
  getSubjectAssignments,
  deleteAssignment,
} from "../Controllers/assignmentController.js";
import { authorization } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:assignedTeacher", authorization, fetchAssignments);
router.get("/get-assignment/:assignmentId", authorization, fetchAssignmentById);
router.post("/create-assignment", authorization, createAssignment);
router.delete("/delete-assignment/:assignmentId", authorization, deleteAssignment);
router.get("/classroom/:classroomId", authorization, getSubjectAssignments);
// Export the router for use in the main server file
export default router;
