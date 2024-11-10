import AsideNav from "@/components/AppComponents/AsideNav";
import { config, path } from "@/path";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const Assignment = () => {
  const user = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const [expiredAssignments, setExpiredAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignmentById = async () => {
      const assignments = await axios.get(
        `${path}/assignment/classroom/${user?.classroom}`,
        config
      );
      if (assignments.data) {
        setAssignments(
          assignments.data.filter(
            (assignment) => assignment.currentlyAvailable === true
          )
        );
        setExpiredAssignments(
          assignments.data.filter(
            (assignment) => assignment.currentlyAvailable === false
          )
        );

        // for (let i = 0; i < assignments.length; i++) {
        //   if (assignments[i].submissions.include(user._id)) {
        //     setSubmittedAssignments((prev) => [...prev, assignments[i]]);
        //   }
        // }
      } else {
        toast.error("Failed to fetch assignments");
      }
    };
    fetchAssignmentById();
  }, [user.classroom]);

  return (
    <div className="md:flex">
      <AsideNav />
      <Toaster position="bottom-center" richColors />
      <section className="flex-1 px-4 py-6 flex flex-col gap-6 w-full">
        <div className="title w-3/4">Assignment</div>
        <div className="mt-4">
          <div className="title">Available</div>
          <div className="flex flex-col gap-2">
            {assignments.map((assignment) => {
              let submitted = false;

              for (let submission of assignment.submissions) {
                // console.log(submission)
                if (submission.studentId === user._id) {
                  submitted = true;
                  break;
                }
              }

              return (
                <div
                  onClick={
                    submitted
                      ? () => toast.success("Already submitted")
                      : () => navigate(`/assignments/${assignment._id}`)
                  }
                  key={assignment._id}
                  className={`flex p-3 border items-center justify-center hover:bg-gray-200 ease-in-out transition-all cursor-pointer w-full rounded-md  bg-green-200 `}
                >
                  <div className="w-full items-center justify-between">
                    <div className="title">{assignment.name}</div>
                    <div>{assignment.dueDate.split("T")[0]}</div>
                  </div>
                  <div>
                    <div>{assignment.subjectId.paperName}</div>
                    <div className="font-medium">
                      {assignment.assignedTeacher.name}
                    </div>
                  </div>
                  {submitted && (
                    <div className="bg-green-300 px-2 text-center rounded-full ">
                      Submitted
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4">
          <div className="title">Expired</div>
          <div className="flex flex-col gap-2">
            {expiredAssignments.map((assignment) => {
              let submitted = false;

              console.log(assignment.submissions);
              for (let submission of assignment.submissions) {
                if (submission.studentId === user._id) {
                  submitted = true;
                  break;
                }
              }

              return (
                <div
                  onClick={() => toast.error("Assignment Expired")}
                  key={assignment._id}
                  className={`flex p-3 border items-center justify-center hover:bg-gray-200 ease-in-out transition-all cursor-pointer w-full rounded-md bg-red-200 relative `}
                >
                  <div className="w-full items-center justify-between">
                    <div className="title">{assignment.name}</div>
                    <div>{assignment.dueDate.split("T")[0]}</div>
                  </div>
                  {submittedAssignments.length > 0 && (
                    <div>
                      <div className="absolute right-0 top-0 rounded-r-md flex flex-col justify-center  p-2 h-full  bg-green-100">
                        Submitted
                      </div>
                      <div>
                        {submittedAssignments.map((_) => (
                          <div
                            key={_._id}
                            className="flex gap-2 w-full items-center justify-between"
                          >
                            <div className="title">{_.name}</div>
                            <div>{_.dueDate.split("T")[0]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {submitted && (
                    <div className="bg-red-300 px-2 text-center rounded-full ">
                      Submitted
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Assignment;
