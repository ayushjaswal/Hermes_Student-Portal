import AsideNav from "@/components/AppComponents/AsideNav";
import CourseChart from "@/components/AppComponents/CourseChart";
import { config, path } from "@/path";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";

const CoursesPage = () => {
  const { courseId } = useParams();
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [notSubmittedAssignments, setNotSubmittedAssignments] = useState([]);
  const user = useSelector((state) => state.user);
  const [course, setCourse] = useState();
  const navigate = useNavigate();
  const [courseStudentResult, setCourseStudentResult] = useState([]);
  const [studentStats, setStudentStats] = useState({
    studentResult: 0,
    averageResult: 0,
    highestResult: 0,
    lowestResult: 0,
  });

  useEffect(() => {
    // Fetch course details
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${path}/class/get-subject/${courseId}`,
          config
        );
        if (response.data) {
          setCourse(response.data);
        } else {
          toast.error("Failed to fetch course");
        }
      } catch (error) {
        toast.error("Error fetching course: " + error.message);
      }
    };
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    // Fetch results of all students for this course
    const fetchCourseStudentResult = async () => {
      if (!course?._id) return;
      try {
        const response = await axios.get(
          `${path}/result/${user._id}/get-student-subject-result/${course._id}`,
          config
        );
        if (response.data) {
          setCourseStudentResult(response.data);
        }
      } catch (error) {
        console.error("Error fetching course student result", error);
      }
    };
    fetchCourseStudentResult();
  }, [user, course]);

  useEffect(() => {
    // Calculate stats once results are fetched
    if (courseStudentResult.length > 0) {
      let studentResult = 0;
      let totalMidSemMarks = 0;
      let highestResult = -Infinity;
      let lowestResult = Infinity;

      courseStudentResult.forEach((result) => {
        const marks = result.midSemMarks;
        if (result.student === user._id) {
          console.log({student: result.student, user: user._id, marks: marks});
          console.log(result.midSemMarks)
          studentResult = marks;
        } 

        totalMidSemMarks += marks;

        if (marks > highestResult) {
          highestResult = marks;
        }

        if (marks < lowestResult) {
          lowestResult = marks;
        }
      });

      const averageResult =
        courseStudentResult.length > 0
          ? totalMidSemMarks / courseStudentResult.length
          : 0;

      setStudentStats({
        studentResult,
        averageResult: averageResult.toFixed(2), // Rounded to 2 decimals
        highestResult,
        lowestResult,
      });
    }
  }, [courseStudentResult, user]);

  useEffect(() => {
    // Fetch assignment submission details
    const fetchSubmittedAssignments = async () => {
      if (!course?._id) return;
      try {
        const response = await axios.get(
          `${path}/assignment/${user._id}/get-submitted-assignments/${course._id}`,
          config
        );
        if (response.data) {
          setSubmittedAssignments(response.data.submitted || []);
          setNotSubmittedAssignments(response.data.notSubmitted || []);
        }
      } catch (error) {
        console.error("Error fetching submitted assignments count", error);
      }
    };

    fetchSubmittedAssignments();
  }, [course, user]);

  return (
    <div className="md:flex">
      <AsideNav />
      <section className="flex-1 mx-4 py-6 flex flex-col gap-6 h-[100vh] overflow-y-scroll">
        <Toaster richColors position="bottom-right" closeButton />
        <div>
          <span className="title">{course?.paperName}</span> (
          {course?.paperCode})
        </div>
        <div>
          <div>Associated Faculty:</div>
          <div className="flex gap-4">
            {course?.associatedFaculty?.map((teacher) => (
              <div
                onClick={() =>
                  navigate("/forum", { state: { selectedTeacher: teacher } })
                }
                key={teacher?.name}
                className="text-center text-sm p-2 border item-center flex justify-center hover:bg-gray-100 rounded-full cursor-pointer transition ease-in-out hover:shadow-sm gap-2"
              >
                <img
                  src={teacher.avatar}
                  className="w-[2rem] h-[2rem] rounded-full object-cover"
                />
                <div className="text-center flex justify-center items-center">
                  {teacher?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="flex flex-col  gap-2 w-full">
            <div className="title">Submitted</div>
            {submittedAssignments.map((assignment) => (
              <div
                className="p-2 px-4 border bg-green-100 rounded-md cursor-pointer flex justify-between"
                key={assignment._id}
              >
                <div>
                  <div className="font-semibold">{assignment.name}</div>
                  <div>{assignment.assignedTeacher.name}</div>
                </div>
                <div>Due Date: {assignment.dueDate.split("T")[0]}</div>
              </div>
            ))}
          </div>
          {notSubmittedAssignments.length > 0 && (
            <div className="flex flex-col  gap-2 w-full">
              <div className="title">Not Submitted</div>
              {notSubmittedAssignments.map((assignment) => (
                <div
                  className="p-2 px-4 border bg-red-100 rounded-md cursor-pointer flex justify-between"
                  key={assignment._id}
                >
                  <div>
                    <div className="font-semibold">{assignment.name}</div>
                    <div>{assignment.assignedTeacher.name}</div>
                  </div>
                  <div>Due Date: {assignment.dueDate.split("T")[0]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-2 p-2">
          <div className="p-2 border rounded-md w-full">
            <h1 className="title">Mid-Sem Result</h1>
            <CourseChart data={courseStudentResult} studentId={user._id} />
          </div>
          <div className="p-2 border rounded-md w-full flex flex-col gap-2">
            <h1 className="title">Your Stats:</h1>
            <div className="border p-2 rounded-md">Mid-Sem Marks: {studentStats.studentResult}</div>
            <div className="border p-2 rounded-md">Class Average: {studentStats.averageResult}</div>
            <div className="border p-2 rounded-md">Highest Mid-Sem Marks: {studentStats.highestResult}</div>
            <div className="border p-2 rounded-md">Lowest Mid-Sem Marks: {studentStats.lowestResult}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
