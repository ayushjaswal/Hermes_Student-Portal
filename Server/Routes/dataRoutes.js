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

export default router;
