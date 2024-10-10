// routes/dataRoutes.js
import express from "express";
import { authorization } from "../middlewares/auth.js";
import { getSubjectsInfo, getSubject } from "../Controllers/classControllers.js";

const router = express.Router();

// Define routes for inserting data
router.get("/get-subjects-info", authorization, getSubjectsInfo)
router.get("/get-subject/:courseId", authorization, getSubject)

export default router;
