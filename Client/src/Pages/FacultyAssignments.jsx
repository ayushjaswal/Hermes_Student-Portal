import AsideNav from "@/components/AppComponents/AsideNav";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { config, path } from "@/path";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const FacultyAssignments = () => {
  const faculty = useSelector((state) => state.faculty);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState();
  const [subject, setSubject] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const closeBox = useRef(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          `${path}/assignment/${faculty._id}`,
          config
        );
        setAssignments(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAssignments();
  }, []);

  const createAssignment = async (e) => {
    e.preventDefault();

    // Validate date
    const today = new Date();
    if (date && date < today) {
      toast.error("Due date must be later than today!");
      return;
    }

    if (!title || !subject || !date || !classroomId) {
      toast.error("Please fill in all fields.");
      return;
    }

    const newAssignment = await axios.post(
      `${path}/assignment/create-assignment`,
      {
        name: title,
        subjectId: subject,
        dueDate: date,
        classroomId,
        assignedTeacher: faculty._id,
      },
      config
    );
    setAssignments((prev) => [...prev, newAssignment.data]);
    if (!newAssignment.data) {
      toast.error("Failed to create assignment.");
      return;
    }
    toast.success("Assignment created successfully!");
    // Clear form fields after successful submission
    setTitle("");
    setDate(null);
    setSubject("");
    closeBox.current.click();
  };

  return (
    <div className="md:flex min-h-screen ">
      <AsideNav />
      <section className="flex-1 mx-4 mt-6 flex flex-col gap-6 w-full">
        <Toaster richColors position="bottom-center" />
        <div>
          <Dialog>
            <DialogTrigger>
              <Button variant="ghost" className="border">
                Create assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create an Assignment</DialogTitle>
                <form
                  onSubmit={createAssignment}
                  className="mt-4 flex flex-col gap-4"
                >
                  <div className="flex flex-col ">
                    <label htmlFor="title" className="">
                      Title:
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      id="title"
                      placeholder="title"
                      className="border px-2 py-1 rounded-md shadow-sm outline-none focus:ring-blue-400 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col ">
                    <label htmlFor="subject" className="">
                      Subject:
                    </label>
                    <Select onValueChange={setSubject}>
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculty.subjects.map((subject) => (
                          <SelectItem
                            value={subject._id}
                            key={subject.paperCode}
                          >
                            {subject.paperName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col ">
                    <label htmlFor="classroom" className="">
                      Class:
                    </label>
                    <Select onValueChange={setClassroomId}>
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculty.classroom.map((c) => (
                          <SelectItem value={c._id} key={c.classroomId}>
                            {c.classroomId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div>Due date: </div>
                    <div className="flex items-center justify-center w-full">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    className="btn w-full"
                  >
                    Submit
                  </Button>
                </form>
              </DialogHeader>
              <DialogClose id="dialog-close-button" ref={closeBox} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex  flex-col gap-2">
          {assignments.map((assignment) => (
            <div
              className="flex justify-between items-center border p-3 rounded hover:bg-gray-100 cursor-pointer"
              key={assignment.name}
              onClick={() =>
                navigate(`/faculty-assignments-submissions/${assignment._id}`)
              }
            >
              <div>
                <div className="title">{assignment.name}</div>
                <div>Due date: {assignment.dueDate.split("T")[0]}</div>
              </div>
              <div className="title">
                Submissions: {assignment.submissions?.length}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FacultyAssignments;
