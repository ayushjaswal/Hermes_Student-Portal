// controllers/dataControllers.js
import student from "../Models/StudentUser.model.js";
import faculty from "../Models/FacultyUser.model.js";
import subject from "../Models/Subject.model.js";
import branch from "../Models/Branch.model.js";
import fs from "fs";

// Function to insert student data from JSON
export const insertStudents = async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("data/students.json", "utf-8"));
    for (let i = 0; i < data.length; i++) {
      let subjectArray = [];
      for (let j = 0; j < data[i].Subjects.length; j++) {
        const subject = await subject.findOne({ paperName: data[i].Subjects[j] })
        subjectArray.push(subject._id);
      }
      let emailString = "";
      emailString += data[i].Name.split(" ")[0] + data[i]['Enroll.No.'].toString().spli("208")[0];
      switch (data[i].Branch ){
        case "CSE":
          data[i].Branch = "";
          break;
        case "IT":
          data[i].Branch = "031";
          break;
        case "ECE":
          data[i].Branch = "";
          break;
        case "EEE":
          data[i].Branch = "";
          break;
        default:
          data[i].Branch = "Unknown";
          break;
      }
      const newStudent = await student({subjects: subjectArray, });
    }
    return res
      .status(200)
      .json({ message: "Student data inserted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error inserting student data" });
  }
};

export const inserSingleStudent = async (req, res) => {
  try {
    const {email, enrollment, name, branchName, subjects} = req.body;
    const branchDb = await branch.findOne({ branchName })
    
    const branchId = branchDb?._id;
    let subjectArray = [];
    for (let i = 0; i < subjects?.length; i++) {
      const subjectDb = await subject.findOne({ paperCode: subjects[i] });
      subjectArray.push(subjectDb?._id);
    }
    const newStudent = await student.create({email, enrollment, name, branch: branchId, subjects: subjectArray})
    const newUser = await user.create({email, password: enrollment });
    return res
      .status(200)
      .json({ message: "Student created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating student data" });
  }
}

// Function to insert faculty data from JSON
export const insertFaculty = async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("data/faculty.json", "utf-8"));
    await faculty.insertMany(data);
    return res
      .status(200)
      .json({ message: "Faculty data inserted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error inserting faculty data" });
  }
};

// Function to insert subject data from JSON
export const insertSubjects = async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("data/subjects.json", "utf-8"));
    await subject.insertMany(data);
    return res
      .status(200)
      .json({ message: "Subject data inserted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error inserting subject data" });
  }
};

export const getData = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("json_data.json", "utf-8"));
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error getting subject data" });
  }
};
export const getSubjectData = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("data/subjects.json", "utf-8"));
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error getting subject data" });
  }
};
