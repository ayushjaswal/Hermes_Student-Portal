import { jwtDecode } from "jwt-decode";
import student from "../Models/StudentUser.model.js";
import subject from "../Models/Subject.model.js";
import classroom from "../Models/Classroom.model.js";

export const getSubjectsInfo = async (req, res) => {
  try {
    const { token } = req;
    const email = jwtDecode(token).email;
    const subjects = await student
      .findOne({ email }, { subjects: 1, _id: 0 })
      .populate("subjects");
    return res.json(subjects);
  } catch (error) {
    console.log(error.message);
    return res.json({ error: error });
  }
};
export const getSubject = async (req, res) => {
  try {
    const { courseId } = req.params;
    const courseDb = await subject
      .findOne({ paperCode: courseId })
      .populate("associatedFaculty");
    if (courseDb) {
      return res.status(200).json(courseDb);
    } else {
      return res.status(400).json({ message: "No such course" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error });
  }
};

export const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const roomDb = await classroom.findById(roomId).populate({
      path: "messages",
      select: "message sender",
      populate: {
        path: "sender",
        select: "email",
      },
    });

    if (roomDb) {
      return res.status(200).json(roomDb);
    } else {
      return res.status(400).json({ message: "No such room" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error });
  }
};
