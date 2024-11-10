// routes/dataRoutes.js
import express from "express";
import { authorization } from "../middlewares/auth.js";
import { submitAssignment } from "../Controllers/submissionController.js";

const router = express.Router();

// Define routes for inserting data
router.post("/submit-assignment", authorization, submitAssignment);
export default router;
