import { useState } from "react";
import Typical from "react-typical";
import axios from "axios";
import { config, path } from "@/path";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const ChangePassword = () => {
  const { state } = useLocation();
  const { email } = state;
  const [changePasswordData, setChangePasswordData] = useState({
    email,
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const handleChangePassword = async (ev) => {
    ev.preventDefault();
    console.log(changePasswordData);
    if (changePasswordData.confirmPassword !== changePasswordData.newPassword) {
      toast.warning("Passwords do not match");
    } else {
      const result = await axios.post(
        `${path}/auth/change-password`,
        changePasswordData,
        config
      );
      if (result.data.success) {
        navigate("/login");
      } else {
        toast.error(result.data.error);
      }
    }
  };

  return (
    <div className="flex">
      <Toaster richColors />
      <div className="flex w-full h-[100vh] items-center justify-center ">
        <form
          onSubmit={handleChangePassword}
          className="flex flex-col gap-3  w-[50%]"
        >
          <h1 className="title">Change Password</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="newPassword">New password</label>
            <input
              value={changePasswordData.newPassword}
              onChange={(e) =>
                setChangePasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              id="newPassword"
              type="password"
              className="inp"
              placeholder="new password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              value={changePasswordData.confirmPassword}
              onChange={(e) =>
                setChangePasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              id="confirmPassword"
              type="password"
              className="inp"
              placeholder="confirm password"
            />
          </div>
          <button type="submit" className="btn">
            Change Password
          </button>
        </form>
      </div>
      <div className="grad w-full h-[100vh] flex text-center items-center justify-center text-white text-[4rem] font-extrabold">
        <Typical
          steps={["Student Portal", 5000, "Change Password", 5000]}
          loop={Infinity}
          wrapper="p"
        />
      </div>
    </div>
  );
};

export default ChangePassword;
