// routes/dataRoutes.js
import express from "express";
import {
  insertStudents,
  insertFaculty,
  insertSubjects,
  getData,
  getSubjectData,
  inserSingleStudent,
  inserSingleFaculty,
  insertBranch
} from "../Controllers/dataControllers.js";

const router = express.Router();

// Define routes for inserting data
router.post("/insert-students", insertStudents);
router.post("/insert-faculty", insertFaculty);
router.get("/insert-subjects", insertSubjects);
router.get("/", getData);
router.get("/subjects", getSubjectData);
router.post("/create-student", inserSingleStudent);
router.post("/create-faculty", inserSingleFaculty);
router.post("/create-branch", insertBranch)

export default router;
