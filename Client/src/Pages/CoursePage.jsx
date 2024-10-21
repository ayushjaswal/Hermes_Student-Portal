import AsideNav from "@/components/AppComponents/AsideNav";
import { config, path } from "@/path";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";

const CoursesPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const navigate = useNavigate();

  useEffect(() => {
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

  return (
    <div className="md:flex ">
      <AsideNav />
      <section className="flex-1 mx-4 py-6 flex flex-col gap-6 overflow-y-scroll">
        <Toaster richColors position="bottom-right" closeButton />
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between text-xl">
            <div className="title">{course?.paperName}</div>
            <div>{course?.paperCode}</div>
          </div>
          <div className="flex gap-2 ">
            Resources:
            <a className="link" href="https://syllabusx.live/" target="_blank">
              Syllabusx
            </a>
            <a
              className="link"
              href="https://www.youtube.com/@GateSmashers"
              target="_blank"
            >
              Gate Smashers
            </a>
          </div>
        </div>
        <div>Taught By:</div>
        <div className="flex gap-4">
          {course?.associatedFaculty?.map((teacher) => (
            <div key={teacher?.name} className="w-[4rem] text-center text-sm">
              <img
                src={teacher.avatar}
                className="w-[4rem] h-[4rem] rounded-full object-fit"
              />
              <div>{teacher?.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
