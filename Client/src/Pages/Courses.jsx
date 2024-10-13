import AsideNav from "@/components/AppComponents/AsideNav";
import Card from "@/components/AppComponents/Card";
import { config, path } from "@/path";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();
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
    <div className="md:flex ">
      <AsideNav />
      <section className="px-5 py-4   flex flex-col gap-2  ">
        <div className="title w-3/4">Courses</div>
        <div className="">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            {subjects.map((subject) => (
              <div key={subject.paperCode}>
                <Card props={subject} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
