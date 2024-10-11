import AsideNav from "@/components/AppComponents/AsideNav";
import Card from "@/components/AppComponents/Card";
import { config, path } from "@/path";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const user = useSelector((state) => state.user);
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
      <section className="px-5 py-4  flex flex-col gap-2  ">
        <div className="title w-3/4">Dashboard</div>
        <div className="w-full relative border border-1 rounded-md px-4 py-4">
          <div>
            <div className="flex items-center gap-2 text-[2rem] text-center">
              <img
                className="h-[8rem] w-[8rem] rounded-full object-cover	"
                src={user.avatar}
              />
              {user.name}
            </div>
            <div>
              <span className="font-semibold">Enrollment:</span>{" "}
              {user.enrollment}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.email}
            </div>
          </div>
          <div onClick={()=>navigate("/edit-profile") } className="absolute top-0 right-0 mr-3 bg-gray-200 p-2 mt-2 rounded-md cursor-pointer hover:bg-gray-300 transition ease-in-out">Edit</div>
        </div>
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

export default Dashboard;
