import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { removeUser } from "@/store/features/user";
import axios from "axios";
import { config, path } from "@/path";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import dashboardIcon from "../../assets/dashboard.svg";
import classIcon from "../../assets/class.svg";
import courseIcon from "../../assets/course.svg";
import profileIcon from "../../assets/profile.svg";
import assignmentIcon from "../../assets/assignment.svg";
import forumIcon from "../../assets/forum.svg";
import logout from "../../assets/logout.svg";

const AsideNav = () => {
  const dispatch = useDispatch();
  const [loginingOut, setLoginginOut] = useState(false);
  const navMenu = [
    {
      icon: dashboardIcon,
      route: "Dashboard",
      path: "/dashboard",
    },
    { icon: classIcon, route: "Classroom", path: "/classroom" },
    { icon: courseIcon, route: "Courses", path: "/courses" },
    { icon: profileIcon, route: "Profile", path: "/profile" },
    {
      icon: assignmentIcon,
      route: "Assignment",
      path: "/assignments",
    },
    {
      icon: forumIcon,
      route: "Contact",
      path: "/forum",
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
    <aside className="flex md:flex-col p-4  gap-2 md:h-[100vh] md:w-[12rem] bg-gray-100 justify-between">
      <div className=" flex md:flex-col gap-1 md:gap-2  ">
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
                "size-[1rem] " +
                (!location.pathname.includes(elm.path) ? "  " : "invert ")
              }
              src={elm.icon}
              alt={elm.route + "-icon"}
            />
            <div className="hidden md:block">{elm.route}</div>
          </div>
        ))}
      </div>
      <Button className="flex gap-2 items-center flex-shrink-0" onClick={handleLogout}>
        <img className="size-[1rem]" src={logout} />
        <div className="hidden md:block">
          {loginingOut ? <TailSpin height={16} color="white" /> : "Logout"}
        </div>
      </Button>
    </aside>
  );
};

export default AsideNav;
