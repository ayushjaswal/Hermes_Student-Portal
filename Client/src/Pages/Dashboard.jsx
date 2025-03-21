import AsideNav from "@/components/AppComponents/AsideNav";
import Card from "@/components/AppComponents/Card";
import ResultChart from "@/components/AppComponents/ResultChart";
import SemesterSummaryChart from "@/components/AppComponents/SemestrySummaryChart";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  return (
    <div className="md:flex min-h-screen bg-white">
      <AsideNav />
      <section className="flex-1 mx-4 py-6 flex flex-col gap-6 h-[100vh] overflow-y-scroll">
        {/* Dashboard Title */}
        <div className="text-3xl font-bold text-gray-900">Dashboard</div>

        {/* Profile Section */}
        <div className="relative bg-white border border-gray-300 rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {user.avatar ? (
              <img
                className="h-32 w-32 rounded-full object-cover border border-gray-200 shadow-sm"
                src={user.avatar}
                alt="User Avatar"
              />
            ) : (
              <div className="w-32 h-32 text-center flex flex-col items-center justify-center text-[4rem] rounded-full border border-gray-200 shadow-sm bg-red-300">
                {user.name[0]}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-semibold text-gray-800">
                {user.name}
              </div>
              <div>
                <span className="font-medium text-gray-600">Enrollment:</span>{" "}
                {user.enrollment}
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>{" "}
                {user.email}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div
            onClick={() => navigate("/profile/edit")}
            className="absolute top-0 right-0 mr-3 border p-2 mt-2 rounded-md cursor-pointer hover:bg-gray-100 transition ease-in-out"
          >
            Edit
          </div>
        </div>

        <div className="result-chart flex flex-col md:flex-row gap-2 ">
          <div className="border p-2 rounded-md shadow-sm border-gray-300 ">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Latest Semester Result
            </h2>
            <ResultChart studentId={user._id} />
          </div>
          <div className="border p-2 rounded-md shadow-sm border-gray-300 ">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 ">
              Semester Results
            </h2>
            <SemesterSummaryChart studentId={user._id} />
          </div>
        </div>
        {/* Subjects Section */}
        <div >
          <div className="text-2xl font-semibold text-gray-700">
            Your Courses
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {user.subjects?.map((subject) => (
              <div key={subject?.paperCode}>
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
