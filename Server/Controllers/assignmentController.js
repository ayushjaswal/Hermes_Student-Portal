import assignment from "../Models/Assignment.model.js";
import submission from "../Models/Submission.model.js";

export const fetchAssignments = async (req, res) => {
  try {
    const { assignedTeacher } = req.params;
    const assignments = await assignment
      .find({ assignedTeacher })
      .populate("subjectId");
    if (assignments) {
      return res.status(200).json(assignments);
    } else {
      return res
        .status(404)
        .json({ message: "No assignments found for this subject" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching assignments" });
  }
};

export const fetchAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignmentDb = await assignment.findById(assignmentId).populate([
      {
        path: "submissions",
        populate: {
          path: "studentId",
          select: "name",
        },
      },
      {
        path: "classroomId",
      },
    ]);

    if (assignmentDb) {
      return res.status(200).json(assignmentDb);
    } else {
      return res
        .status(404)
        .json({ message: "No assignment found with this ID" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching assignment" });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const {
      name,
      dueDate,
      subjectId,
      classroomId,
      assignedTeacher,
      attachment,
    } = req.body;
    const newAssignment = await assignment.create({
      name,
      dueDate,
      subjectId,
      classroomId,
      assignedTeacher,
      attachment,
    });
    if (newAssignment) {
      return res.status(201).json(newAssignment);
    } else {
      return res.status(400).json({ message: "Invalid assignment data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating assignment" });
  }
};

export const getSubjectAssignments = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const assignments = await assignment
      .find({ classroomId })
      .populate(["subjectId", "assignedTeacher", "submissions"]);

    if (assignments.length === 0) {
      return res
        .status(404)
        .json({ message: "No assignments found for this classroom" });
    }

    const updatePromises = assignments.map(async (assignment) => {
      if (new Date(assignment.dueDate) < new Date()) {
        assignment.currentlyAvailable = false;
        return await assignment.save();
      }
    });

    await Promise.all(updatePromises);

    return res.status(200).json(assignments);
  } catch (error) {
    console.error(error); // Optional: log the error for debugging
    return res.status(500).json({ message: "Error fetching assignments" });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const deletedAssignment = await assignment.findByIdAndDelete(assignmentId);
    if (deletedAssignment) {
      await submission.deleteMany({ assignmentId });
      return res
        .status(200)
        .json({ message: "Assignment deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "No assignment found with this ID" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting assignment" });
  }
};

export const getSubmittedAssignments = async (req, res) => {
  const { studentId, subjectId } = req.params; // Assuming subjectId is passed in the URL

  try {
    console.log({ studentId, subjectId });
    // Step 2: Fetch all assignments for the given subject
    const assignments = await assignment
      .find({
        subjectId: subjectId,
      })
      .populate(["subjectId", "submissions", "assignedTeacher"]);

    // Step 3: Create an object to categorize submitted and not submitted assignments
    const result = {
      submitted: [],
      notSubmitted: [],
    };

    assignments.forEach((assignment) => {
      if (assignment.submissions.length > 0) {
        for (let submission of assignment.submissions) {
          if (submission.studentId.toString() === studentId) {
            result.submitted.push(assignment);
            break;
          } else {
            result.notSubmitted.push(assignment);
            break;
          }
        }
      } else {
        result.notSubmitted.push(assignment);
      }
    });

    // // Step 4: Loop through the assignments and categorize them
    // assignments.forEach((assignmentItem) => {
    //   // Check if there is a corresponding submission for the assignment
    //   const submissionExists = submissions.some(
    //     (submissionItem) =>
    //       submissionItem.assignmentId._id.toString() ===
    //       assignmentItem._id.toString()
    //   );

    //   if (submissionExists) {
    //     result.submitted.push(assignmentItem);
    //   } else {
    //     result.notSubmitted.push(assignmentItem);
    //   }
    // });

    // // Step 5: Sen d the response
    res.json(result);
  } catch (error) {
    console.error("Error fetching student submissions", error);
    res.status(500).json({ message: "Error fetching student submissions" });
  }
};
