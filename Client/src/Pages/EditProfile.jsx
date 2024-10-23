import AsideNav from "@/components/AppComponents/AsideNav";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { storage } from "@/firebase";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { config, path } from "@/path";

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    avatar: user.avatar,
    DOB: user.DOB,
    ABCId: user.ABCId,
  });
  const navigate = useNavigate();
  const handleProfileImageRemove = () => {};

  const handleProfileImageEdit = async (event) => {
    const file = event.target.files[0];
    const fileName = Date.now() + "." + file.name.split(".").pop();
    const imageRef = ref(storage, `profile/${fileName}`);
    try {
      await uploadBytesResumable(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setFormData({ ...formData, avatar: url });
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to upload image!");
    }
  };

  const handleSaveEditedChanges = async () => {
    try {
      const res = await axios.post(
        `${path}/auth/edit-profile`,
        formData,
        config
      );
      if (res) {
        toast.success("Profile edited successfully!");
        navigate("/profile");
      } else {
        toast.error("Failed to edit profile!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit profile!");
    }
  };

  return (
    <div className="md:flex h-[100vh]">
      <AsideNav />
      <Toaster richColors position="bottom-right" />
      <section className="flex-1 mx-4 py-6 flex flex-col gap-6 md:overflow-y-scroll">
        <div className="title w-full">Edit Profile</div>
        <div className="text-[12px]">*Cannot edit verified values</div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {formData.avatar ? (
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
            <Button
              onClick={() => fileInputRef.current.click()}
              className="btn"
            >
              { user.avatar ? "Update" : "Add"}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleProfileImageEdit}
                style={{ display: "none" }}
              />
            </Button>
            {user.avatar && (
              <Button
                onClick={handleProfileImageRemove}
                variant={"destructive"}
                className="btn"
              >
                Remove
              </Button>
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
              value={formData.DOB?.split("T")[0]}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, DOB: event.target.value }))
              }
              placeholder="DOB"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="label">ABCId:</label>
            <input
              className="inp"
              value={formData.ABCId}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, ABCId: event.target.value }))
              }
              placeholder="ABCID"
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
        <div className="flex md:flex-row flex-col gap-2">
          <Button
            onClick={handleSaveEditedChanges}
            variant="primary"
            className="btn md:w-full"
          >
            Save Changes
          </Button>
          <Button
            onClick={() => navigate("/profile")}
            className="btn md:w-full"
          >
            Cancel
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
