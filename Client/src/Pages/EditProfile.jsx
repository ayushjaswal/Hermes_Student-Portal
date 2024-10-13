import AsideNav from "@/components/AppComponents/AsideNav";
import React from "react";
import { useSelector } from "react-redux";

const EditProfile = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="md:flex">
      <AsideNav />
      <section className="mx-4 my-4 flex flex-col gap-4">
        <div className="title w-full">Edit Profile</div>
        <div className="text-[12px]">*Cannot edit verified values</div>
        <div className="flex flex-col gap-4">
          <div>
            Profile Picture:
            <img
              src={user.avatar}
              alt="Profile Avatar"
              className="w-[10rem] h-[10rem] object-cover rounded-full border"
            />
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
            <label className="label">DOB:</label>
            <input
              type="date"
              className="inp"
              value={user.DOB}
              placeholder="DOB"
              disabled // Assuming DOB should not be editable
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="label">ABCId:</label>
            <input
              className="inp"
              value={user.ABCId}
              placeholder="ABCID"
              disabled // Assuming ABCId should not be editable
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="label">Subjects:</label>
            <input
              className="inp"
              value={user.subjects.join(", ")} // Displaying subjects as a comma-separated list
              placeholder="Subjects"
              disabled
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
