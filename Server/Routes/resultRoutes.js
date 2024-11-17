import express from "express";
import {
  addResult,
  getResultsByStudent,
  bulkAddResults,
  getSemesterSummary,
  addMidSemResult,
  getSubjectResult,
} from "../Controllers/resultController.js";
import { authorization } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", addResult);
router.get("/student/:studentId", getResultsByStudent);
router.post("/bulk-add-results", bulkAddResults);
router.get("/student/:studentId/semester-summary", getSemesterSummary);
router.post("/midsem-result", authorization, addMidSemResult);
router.get("/:student/get-student-subject-result/:subject", authorization, getSubjectResult)

export default router;
