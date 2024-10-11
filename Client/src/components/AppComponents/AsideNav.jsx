import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { removeUser } from "@/store/features/user";
import axios from "axios";
import { config, path } from "@/path";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";

const AsideNav = () => {
  const dispatch = useDispatch();
  const [loginingOut, setLoginginOut] = useState(false);
  const navMenu = [
    {
      icon: "src/assets/dashboard.svg",
      route: "Dashboard",
      path: "/dashboard",
    },
    { icon: "src/assets/class.svg", route: "Classroom", path: "/classroom" },
    { icon: "src/assets/course.svg", route: "Courses", path: "/courses" },
    { icon: "src/assets/profile.svg", route: "Profile", path: "/profile" },
    {
      icon: "src/assets/assignment.svg",
      route: "Assignment",
      path: "/assignments",
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavRoute = (nav) => {
    navigate(nav.path);
  };

  const handleLogout = async () => {
    setLoginginOut(true);
    await axios.get(`${path}/auth/logout`, config);
    dispatch(removeUser());
    setLoginginOut(false);
  };

  return (
    <aside className="flex md:flex-col p-4 gap-2 md:h-[100vh] bg-gray-100 justify-between">
      <div className=" flex md:flex-col gap-2 ">
        {navMenu.map((elm) => (
          <div
            className={
              "nav-elm flex gap-2 " +
              (location.pathname.includes(elm.path)
                ? " active-nav-elm text-white"
                : "")
            }
            onClick={() => handleNavRoute(elm)}
            key={elm.route}
          >
            <img
              className={
                "" + (location.pathname !== elm.path ? "  " : "invert ")
              }
              src={elm.icon}
              alt="nav-icon"
            />
            <div className="hidden md:block">{elm.route}</div>
          </div>
        ))}
      </div>
      <Button onClick={handleLogout}>
        {loginingOut ? <TailSpin height={16} color="white" /> : "Logout"}
      </Button>
    </aside>
  );
};

export default AsideNav;
