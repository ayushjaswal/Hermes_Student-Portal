import AsideNav from "@/components/AppComponents/AsideNav";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { config, path } from "@/path";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/firebase";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const AssignmentPage = () => {
  const { assignmentId } = useParams();
  const user = useSelector((state) => state.user);

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleSubmission = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = Date.now() + "." + file.name.split(".").pop();
    const assignmentRef = ref(storage, `submissions/${fileName}`);

    try {
      const uploadTask = uploadBytesResumable(assignmentRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          toast.error("Failed to upload file!");
          setUploadProgress(0);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setSubmission(url);
          toast.success("File uploaded successfully!");
          setUploadProgress(0);
        }
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to upload file!");
    }
  };

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
      const fileRef = ref(storage, submission);
      await deleteObject(fileRef);
      toast.success("Assignment deleted successfully");
      setSubmission(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete assignment");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${path}/submission/submit-assignment`,
        { studentId: user._id, assignmentId, submittedFile: submission },
        config
      );
      if (response.data) {
        toast.success("Assignment submitted successfully!");
          navigate("/assignments")
        
      } else {
        toast.error("Failed to submit assignment");
      }
    } catch (error) {
      toast.error("Failed to submit assignment");
      console.error(error);
    }
  };

  return (
    <div className="md:flex">
      <AsideNav />
      <section className="flex-1 px-4 py-6 flex flex-col gap-6 w-full">
        <Toaster richColors position="bottom-center" />
        <div className="title w-3/4">Assignment</div>
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
            </div>
            {assignment.description && (
              <div>
                <div className="text-gray-700">Description:</div>
                <div>{assignment.description}</div>
              </div>
            )}
            {
              <div className="flex gap-2 flex-col">
                <label className="title">Submit Assignment:</label>
                <div className="flex gap-2 ">
                  <Input
                    onChange={handleSubmission}
                    type="file"
                    className="cursor-pointer"
                    placeholder="Enter your submission(pdf)"
                  />
                  {submission && <Button onClick={handleAssignmentDelete} variant="destructive">Delete</Button>}
                </div>
                {uploadProgress > 0 && (
                  <div className="mt-2">
                    <Progress value={uploadProgress} />
                    <div className="text-center">
                      {Math.round(uploadProgress)}%
                    </div>
                  </div>
                )}
                <Button
                  onClick={handleSubmit}
                  variant="default"
                  className="btn w-full"
                >
                  Submit
                </Button>
              </div>
            }
          </>
        ) : (
          <div>Loading assignment details...</div>
        )}
      </section>
    </div>
  );
};

export default AssignmentPage;
