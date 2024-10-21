import AsideNav from "@/components/AppComponents/AsideNav";
import { path } from "@/path";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import sendIcon from "../assets/send.svg";
import { useSelector } from "react-redux";

const Classroom = () => {
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  // useEffect(()=> {

  // }, [socket])
  useEffect(() => {
    const socketInstance = io(`${path}`, {
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket:", socketInstance.id);
    });

    socketInstance.on("roomMsg", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socketInstance.on("dissconnect", () => {
      console.log("Disconnected from socket:", socketInstance.id);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message", {roomId: user.classroom, message: inputMessage});
    setInputMessage("");
  };
  return (
    <div className="md:flex ">
      <AsideNav />
      <section className="w-full">
        <div className="flex-1 mx-4 py-6 flex flex-col gap-6 title">
          Classroom
        </div>
        <div className="flex flex-col items-end w-full">
          <div className="w-full p-[1rem]">
            {messages.map((message) => (
              <div
                className={`flex w-full p-[1rem] mt-2  border-gray-300 border text-wrap rounded-md ${
                  message?.senderId?.email == user.email
                    ? " bg-blue-500 "
                    : " border-1 "
                }`}
                key={message}
              >
                {message}
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-center w-full px-3">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="inp"
              placeholder="message..."
            />
            <Button
              className="flex items-center flex-shrink-0 px-4 py-5 "
              onClick={sendMessage}
            >
              <img className="size-[1rem]" src={sendIcon} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Classroom;
