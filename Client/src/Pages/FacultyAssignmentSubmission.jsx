import AsideNav from "@/components/AppComponents/AsideNav";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { config, path } from "@/path";
import axios from "axios";
import { useSelector } from "react-redux";

const FacultyAssignmentSubmission = () => {
  const { assignmentId } = useParams();
  const faculty = useSelector((state) => state.faculty);
  const [assignment, setAssignments] = useState();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `${path}/assignment/get-assignment/${assignmentId}`,
          config
        );
        if (response.data) {
          setAssignments(response.data);
        } else {
          toast.error("Failed to fetch assignment");
        }
      } catch (error) {
        toast.error("Failed to fetch assignment details");
        console.log(error);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  return (
    <div className="md:flex min-h-screen ">
      <AsideNav />
      <section className="flex-1 mx-4 mt-6 flex flex-col gap-6 w-full">
        <Toaster richColors position="bottom-center" />
        <div>
          <div className="title">{assignment?.name}</div>
          <div className="md:flex justify-between w-full text-2xl">
            <div>{assignment?.classroomId.classroomId}</div>
            <div> Due date: {assignment?.dueDate.split("T")[0]}</div>
          </div>
          <div>
            <div>Submissions: {assignment?.submissions?.length}</div>
            {assignment?.submissions?.map((submission) => (
              <div key={submission._id}>
                <div>{submission.studentId.name}</div>
                <div>{submission.studentId.enrollment}</div>
                <a href={submission.submittedFile}>File</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FacultyAssignmentSubmission;
