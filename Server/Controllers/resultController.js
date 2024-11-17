// import mongoose, { ObjectId } from "mongoose";
import Result from "../Models/Result.model.js";
import Student from "../Models/StudentUser.model.js";
import Subject from "../Models/Subject.model.js";

export const addResult = async (req, res) => {
  try {
    const {
      student,
      subject,
      semester,
      internalMarks,
      externalMarks,
      remarks,
    } = req.body;

    const result = new Result({
      student,
      subject,
      semester,
      internalMarks,
      externalMarks,
      remarks,
      totalMarks: 100,
    });

    await result.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: "Failed to add result", error });
  }
};

export const getResultsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const semesterQuery = req.query.semester;

    let results;

    if (semesterQuery) {
      // Fetch results for the specific semester requested
      results = await Result.find({
        student: studentId,
        semester: semesterQuery,
      })
        .populate("subject")
        .lean();
    } else {
      // Fetch results for the most recent semester
      // Sort by semester in descending order, and group results by semester
      results = await Result.find({ student: studentId })
        .populate("subject")
        .sort({ semester: -1 }) // Sort in descending order to get the most recent semester
        .lean();

      // Filter only results for the most recent semester
      const highestSemester = results[0]?.semester; // The first element will be from the most recent semester
      results = results.filter((result) => result.semester === highestSemester);
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Results not found" });
    }

    // Add calculated marksObtained for each result
    results.forEach((result) => {
      result.marksObtained = result.internalMarks + result.externalMarks;
    });

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json({ message: "Failed to fetch results", error });
  }
};

export const bulkAddResults = async (req, res) => {
  try {
    const { studentEmail, results } = req.body;

    // Find the student by email
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Process each result entry, find the subject by code, and prepare data
    const resultsData = await Promise.all(
      results.map(async (result) => {
        const subject = await Subject.findOne({
          paperCode: result.subjectCode,
        });
        if (!subject) {
          throw new Error(`Subject with code ${result.subjectCode} not found`);
        }

        // if (
        //   result.internalMarks < 0 ||
        //   result.internalMarks > 50 ||
        //   result.externalMarks < 0 ||
        //   result.externalMarks > 50
        // ) {
        //   throw new Error("Marks should be within valid ranges");
        // }

        return {
          student: student._id,
          subject: subject._id,
          semester: result.semester,
          internalMarks: result.internalMarks,
          externalMarks: result.externalMarks,
          remarks: result.remarks,
          totalMarks: 100,
        };
      })
    );

    // Bulk insert the processed results data
    await Result.insertMany(resultsData);
    res.status(201).json({ message: "Results added successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to add results", error: error.message });
  }
};

export const getSemesterSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch all results for the given student
    const results = await Result.find({ student: studentId });

    // Check if there are results
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for the student" });
    }

    // Initialize an object to store the semester-wise summary
    const semesterSummary = {};

    // Loop through each result and group by semester
    results.forEach((result) => {
      const { semester, internalMarks, externalMarks, totalMarks } = result;

      // Initialize the semester entry if it doesn't exist
      if (!semesterSummary[semester]) {
        semesterSummary[semester] = {
          totalInternalMarks: 0,
          totalExternalMarks: 0,
          totalMarksPossible: 0,
        };
      }

      // Accumulate the marks for each semester
      semesterSummary[semester].totalInternalMarks += internalMarks;
      semesterSummary[semester].totalExternalMarks += externalMarks;
      semesterSummary[semester].totalMarksPossible += totalMarks;
    });

    // Convert the semesterSummary object into an array and calculate percentages
    const finalSummary = Object.keys(semesterSummary).map((semester) => {
      const { totalInternalMarks, totalExternalMarks, totalMarksPossible } =
        semesterSummary[semester];

      const totalMarksObtained = totalInternalMarks + totalExternalMarks;
      const percentage =
        totalMarksPossible > 0
          ? (totalMarksObtained / totalMarksPossible) * 100
          : 0;

      return {
        semester: semester,
        totalInternalMarks,
        totalExternalMarks,
        totalMarksPossible,
        percentage,
      };
    });

    // Sort the result by semester (if needed)
    finalSummary.sort((a, b) => a.semester - b.semester);

    // Return the result
    return res.status(200).json(finalSummary);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch semester summary", error });
  }
};

export const addMidSemResult = async (req, res) => {
  try {
    const { subjectId, studentId, marks } = req.body;

    // Validate input
    if (!subjectId || !studentId || marks == null) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Update the result in the database
    const resultDb = await Result.updateOne(
      { subject: subjectId, student: studentId },
      { $set: { midSemMarks: marks } } // Use $set to ensure field is updated
    );

    // Check if any document was modified
    if (resultDb.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "Mid-sem marks added successfully" });
    } else {
      return res.status(404).json({ message: "Result not found or no changes made" });
    }
  } catch (error) {
    console.error("Error adding mid-sem marks:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const bulkMidSemResultAdd = async (req, res) => {
  try {
    const { results } = req.body; // Expecting an array of { subjectId, studentId, marks }

    // Validate input
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ message: "Invalid or empty input data" });
    }

    const bulkOperations = results.map(({ subjectId, studentId, marks }) => {
      if (!subjectId || !studentId || marks == null) {
        return null; // Skip invalid entries
      }
      return {
        updateOne: {
          filter: { subject: subjectId, student: studentId },
          update: { $set: { midSemMarks: marks } },
          upsert: false, // Optional: Prevent creating new records if they don't exist
        },
      };
    }).filter(Boolean); // Remove null operations

    if (bulkOperations.length === 0) {
      return res.status(400).json({ message: "No valid entries to process" });
    }

    // Execute bulk operation
    const result = await Result.bulkWrite(bulkOperations);

    // Response based on operation result
    return res.status(200).json({
      message: "Bulk mid-sem marks update completed",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount, // Only useful if upsert is enabled
    });
  } catch (error) {
    console.error("Error in bulkMidSemResultAdd:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSubjectResult = async (req, res) => {
  try {
    const { subject } = req.params;
    const resultDB = await Result.find({ subject });
    if (resultDB) {
      return res.status(200).json(resultDB);
    } else {
      return res.status(404).json({ message: "Result not found" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(404).json("Error fetching result");
  }
};
