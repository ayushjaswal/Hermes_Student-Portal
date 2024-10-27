import AsideNav from "@/components/AppComponents/AsideNav";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FacultyClassrooms = () => {
  const classrooms = useSelector((state) => state.faculty.classroom);
  const navigate = useNavigate();

  return (
    <div className="md:flex min-h-screen ">
      <AsideNav />
      <section className="flex-1 mx-4 mt-6 flex flex-col gap-6 w-full">
        <div className="title text-2xl font-bold mb-4">Classroom</div>
        <div className="w-full">
          {classrooms.map((classroom) => (
            <div
              onClick={() => navigate(`/faculty-classroom/${classroom._id}`)}
              className="border border-1 p-3 cursor-pointer hover:bg-gray-100 transition ease-in-out rounded-md w-full"
              key={classroom.classroomId}
            >
              {classroom.classroomId}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FacultyClassrooms;
