import AsideNav from "@/components/AppComponents/AsideNav";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { config, path } from "@/path";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/firebase";
// import { useSelector } from "react-redux";

const FacultyAssignmentSubmission = () => {
  const { assignmentId } = useParams();
  // const faculty = useSelector((state) => state.faculty);
  const [assignment, setAssignment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `${path}/assignment/get-assignment/${assignmentId}`,
          config
        );
        if (response.data) {
          setAssignment(response.data);
        } else {
          toast.error("Failed to fetch assignment");
        }
      } catch (error) {
        toast.error("Failed to fetch assignment details");
        console.error(error);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  const handleAssignmentDelete = async () => {
    try {
      const response = await axios.delete(
        `${path}/assignment/delete-assignment/${assignmentId}`,
        config
      );
      if (response.data) {
        if (assignment.attachment) {
          const fileRef = ref(storage, assignment.attachment);
          await deleteObject(fileRef);
        }
        toast.success("Assignment deleted successfully!");
      } else {
        toast.error("Failed to delete assignment");
      }
    } catch (error) {
      toast.error("Failed to delete assignment");
      console.error(error);
    }
    navigate("/faculty-assignments");
  };

  return (
    <div className="md:flex min-h-screen">
      <AsideNav />
      <section className="flex-1 mx-4 mt-6 flex flex-col gap-6 w-full">
        <Toaster richColors position="bottom-center" />
        {assignment ? (
          <>
            <div className="title">{assignment.name}</div>
            <div className="md:flex justify-between w-full text-2xl">
              <div>{assignment.classroomId.classroomId}</div>
              <div>Due date: {assignment.dueDate.split("T")[0]}</div>
            </div>
            <div className="flex justify-between">
              {assignment.attachment && (
                <a
                  className="link text-blue-500 flex text-center items-center "
                  href={assignment.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-paperclip"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
                  </svg>
                  Attachment
                </a>
              )}
              <div>
                <Button onClick={handleAssignmentDelete} variant="destructive">
                  Delete Assignment
                </Button>
              </div>
            </div>

            <div>
              <div>Submissions: {assignment.submissions?.length}</div>
              <div className="h-[70vh] overflow-y-scroll">
                {assignment.submissions?.map((submission) => (
                  <div
                    key={submission._id}
                    className=" flex gap-2 bg-gray-100 px-2 py-1 rounded-md justify-between m-1"
                  >
                    <div>{submission.studentId.name}</div>
                    <div>{submission.studentId.enrollment}</div>
                    <a
                      href={submission.submittedFile}
                      target="_blank"
                      className="text-blue-500 flex gap-2 items-center"
                    >
                      Submission
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-box-arrow-up-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                        />
                        <path
                          fillRule="evenodd"
                          d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
                        />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>Loading assignment details...</div>
        )}
      </section>
    </div>
  );
};

export default FacultyAssignmentSubmission;
