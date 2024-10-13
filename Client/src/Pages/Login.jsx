import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { config, path } from "@/path";
import { addUser } from "@/store/features/user";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Typical from "react-typical";
import { TailSpin } from "react-loader-spinner";
import { toast, Toaster } from "sonner";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    isFaculty: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [loginingIn, setLoginingIn] = useState(false);

  const handleLogin = async (e) => {
    setLoginingIn(true);
    try {
      e.preventDefault();
      console.log(loginData);
      const result = await axios.post(`${path}/auth`, loginData, config);
      console.log(result.data);
      if (result.data.firstTimer) {
        navigate("/change-password", { state: { email: loginData.email } });
      } else {
        dispatch(addUser(result.data));
      }
      console.log(result)
      if (result.data.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoginingIn(false);
    }
  };
  useEffect(() => {
    if (user.email) {
      console.log(location);
      if (location.state?.from.pathname) {
        navigate(`${location.state?.from.pathname}`);
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate, user, location.state]);
  return (
    <div className="flex">
      <Toaster richColors position="bottom-right" />
      <div className="flex w-full h-[100vh] items-center justify-center ">
        <form onSubmit={handleLogin} className="flex flex-col gap-3  w-[50%]">
          <h1 className="title">Login</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              value={loginData.email}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, email: e.target.value }))
              }
              id="email"
              className="inp"
              placeholder="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              value={loginData.password}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, password: e.target.value }))
              }
              id="password"
              type="password"
              className="inp"
              placeholder="password"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={loginData.isFaculty}
              onCheckedChange={(e) =>
                setLoginData((prev) => ({ ...prev, isFaculty: e }))
              }
              id="faculty"
            />
            <label htmlFor="faculty">Are you a faculty?</label>
          </div>
          <Button variant="primary" type="submit" className="btn">
            {loginingIn ? <TailSpin height={16} color="white" /> : "Login"}
          </Button>
        </form>
      </div>
      <div className="grad w-full h-[100vh] flex text-center items-center justify-center text-white text-[4rem] font-extrabold">
        <Typical
          steps={["Student Portal", 5000, "Login", 5000]}
          loop={Infinity}
          wrapper="p"
        />
      </div>
    </div>
  );
};

export default Login;
