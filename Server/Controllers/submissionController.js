import submission from "../Models/Submission.model.js";
import assignment from "../Models/Assignment.model.js";

export const submitAssignment = async (req, res) => {
  try {
    const { studentId, assignmentId, submittedFile } = req.body;
    const newSubmission = await submission.create({
      studentId,
      assignmentId,
      submittedFile,
    });
    if (newSubmission) {
      try {
        const assignmentDB = await assignment.updateOne(
          { _id: assignmentId },
          { $push: { submissions: newSubmission._id } }
        );
      } catch (error) {
        console.log(error);
      }
      return res
        .status(200)
        .json({ message: "Assignment submitted successfully" });
    } else {
      return res.status(400).json({ message: "Failed to submit assignment" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
