import AsideNav from "@/components/AppComponents/AsideNav";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="md:flex  h-[100vh]">
      <AsideNav />
      <section className="flex-1 mx-4 py-6 flex flex-col gap-6 overflow-y-scroll">
        <div className="title w-full">Profile</div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile Avatar"
                className="w-[10rem] h-[10rem] object-cover border"
              />
            ) : (
              <div className="w-[10rem] h-[10rem] object-cover border text-center flex flex-col justify-center bg-gray-300">
                {" "}
                No image
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="label">Name:</label>
            <input
              className="inp"
              disabled
              value={user.name}
              placeholder="Name"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="label">Email:</label>
            <input
              type="email"
              className="inp"
              value={user.email}
              placeholder="Email"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="label">Enrollment:</label>
            <input
              className="inp"
              value={user.enrollment}
              placeholder="Enrollment Number"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="label">Branch:</label>
            <input
              className="inp"
              value={`${user.branchId.branchName}(${user.branchId.branchCode})`}
              placeholder="Enrollment Number"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="label">DOB:</label>
            <input
              type="date"
              className="inp"
              value={user.DOB?.split("T")[0]}
              placeholder="DOB"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="label">ABCId:</label>
            <input
              className="inp"
              value={user.ABCId}
              placeholder="ABCID"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="label">Subjects:</label>
            <div className=" flex-1 ">
              {user.subjects?.map((subject) => (
                <input
                  key={subject?.paperCode}
                  className="inp mb-2 mr-2"
                  value={subject.paperName}
                  placeholder="Subjects"
                  disabled
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 ">
          <Button
            variant="primary"
            className="btn md:w-full"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </Button>
          <Button
            onClick={() => navigate("/forum")}
            variant="primary"
            className="btn md:w-full"
          >
            Request Changes
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Profile;
