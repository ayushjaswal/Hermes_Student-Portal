import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { config, path } from "./path";
import { addUser } from "./store/features/user";

function App() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchTokenUser = async () => {
      try {
        const response = await axios.get(`${path}/auth/tokenLogin`, config)
        dispatch(addUser(response.data))
      }
      catch (err) { 
          console.log(err)
      }
    }
    fetchTokenUser();
    if (!user.email) {
      navigate("/login")
    }
  }, []);
  return <></>;
}

export default App;
