import AsideNav from "@/components/AppComponents/AsideNav";
import Card from "@/components/AppComponents/Card";
import { config, path } from "@/path";
import axios from "axios";
import { useEffect, useState } from "react";

const Courses = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const subject = await axios.get(
        `${path}/class/get-subjects-info`,
        config
      );
      console.log(subject.data);
      setSubjects(subject.data.subjects);
    };
    fetchSubjects();
  }, []);

  return (
    <div className="md:flex min-h-screen">
      <AsideNav />
      <section className="flex-1 mx-4 mt-6 flex flex-col gap-6">
        <div className="title text-2xl font-bold mb-4">Courses</div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjects.map((subject) => (
            <div key={subject.paperCode}>
              <Card props={subject} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Courses;
