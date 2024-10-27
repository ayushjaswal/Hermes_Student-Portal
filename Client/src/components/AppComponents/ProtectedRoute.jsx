import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { config, path } from "@/path";
import { addUser } from "@/store/features/user";
import { addFaculty } from "@/store/features/faculty";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.email);
  const faculty = useSelector((state) => state.faculty.email);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchTokenUser = async () => {
      try {
        const response = await axios.get(`${path}/auth/tokenLogin`, config)
        if(response.data.isFaculty) {
          dispatch(addFaculty(response.data.facultyData))
        } else {
          dispatch(addUser(response.data))
        }
      }
      catch (err) { 
          console.log(err)
      }
    }
    fetchTokenUser();
    if (!user && !faculty) {
      navigate('/login', { state: { from: location } });
    }
  }, [user, navigate, faculty]);

  return user || faculty ? children : null;
};

export default ProtectedRoute;
