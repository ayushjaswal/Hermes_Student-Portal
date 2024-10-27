import AsideNav from "@/components/AppComponents/AsideNav";
import { config, path } from "@/path";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Assignment = () => {
  const user = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const [expiredAssignments, setExpiredAssignments] = useState([]);

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
      } else {
        toast.error("Failed to fetch assignments");
      }
    };
    fetchAssignmentById();
  }, [user.classroom]);

  return (
    <div className="md:flex">
      <AsideNav />
      <section className="flex-1 px-4 py-6 flex flex-col gap-6 w-full">
        <div className="title w-3/4">Assignment</div>
        <div className="mt-4">
          <div className="title">Available</div>
          <div className="flex flex-col gap-2">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className={`flex p-3 border hover:bg-gray-200 ease-in-out transition-all cursor-pointer w-full rounded-md  bg-green-200 `}
              >
                <div className="w-full items-center justify-between">
                  <div className="title">{assignment.name}</div>
                  <div>{assignment.dueDate.split("T")[0]}</div>
                </div>
                <div>
                  <div>{assignment.subjectId.paperName}</div>
                  <div>Assignee: {assignment.assignedTeacher.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <div className="title">Expired</div>
          <div className="flex flex-col gap-2">
            {expiredAssignments.map((assignment) => (
              <div
                key={assignment._id}
                className={`flex p-3 border hover:bg-gray-200 ease-in-out transition-all cursor-pointer w-full rounded-md bg-red-200 relative `}
              >
                <div className="w-full items-center justify-between">
                  <div className="title">{assignment.name}</div>
                  <div>{assignment.dueDate.split("T")[0]}</div>
                </div>
                {assignment.submissions?.includes(user?._id) && (
                  <div className="absolute right-0 top-0 rounded-r-md flex flex-col justify-center  p-2 h-full  bg-green-100">
                    Submitted
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Assignment;
