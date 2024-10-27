import assignment from "../Models/Assignment.model.js";
import submission from "../Models/Submission.model.js";
export const fetchAssignments = async (req, res) => {
  try {
    const { assignedTeacher } = req.params;
    const assignments = await assignment.find({ assignedTeacher });
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
          path: "student",
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
    const { name, dueDate, subjectId, classroomId, assignedTeacher } = req.body;
    const newAssignment = await assignment.create({
      name,
      dueDate,
      subjectId,
      classroomId,
      assignedTeacher,
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
    const assignments = await assignment.find({ classroomId }).populate(["subjectId", "assignedTeacher" ]);

    if (assignments.length === 0) {
      return res.status(404).json({ message: "No assignments found for this classroom" });
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
