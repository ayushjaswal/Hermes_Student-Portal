import AsideNav from "@/components/AppComponents/AsideNav";
import { config, path } from "@/path";
import { useEffect, useRef, useState } from "react";
import socketService from "@/lib/socketService";
import { Button } from "@/components/ui/button";
import sendIcon from "../assets/send.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useParams } from "react-router-dom";

const FacultyClassroom = () => {
  const dispatch = useDispatch();
  const { classroomId } = useParams();
  const faculty = useSelector((state) => state.faculty);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const endOfMessagesRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    setMessages(faculty.classroom.messages);
  }, [faculty]);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const response = await axios.get(
          `${path}/class/room/${classroomId}`,
          config
        );
        if (response.data) {
          setMessages(response.data.messages);
        } else {
          toast.error("Failed to fetch classroom");
        }
      } catch (error) {
        toast.error("Error fetching classroom");
        console.error(error);
      }
    };
    fetchClassroom();

    socketService.connect(classroomId, faculty._id);

    socketService.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketService.onDisconnect(() => {
      console.log("Disconnected from socket");
    });

    return () => {
      socketService.disconnect();
    };
  }, [dispatch, faculty.classroom]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
    }
  }, [inputMessage]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      socketService.sendMessage({
        roomId: classroomId,
        message: inputMessage,
        senderEmail: faculty.email,
      });
      setInputMessage("");
    }
  };

  return (
    <div className="md:flex min-h-screen bg-white">
      <AsideNav />
      <section className="flex-1 mx-4 pt-6 flex flex-col gap-6">
        <Toaster position="bottom-center" richColors />
        <div className="text-3xl font-bold text-gray-900">Classroom</div>

        <div className="flex flex-col items-end w-full border md:h-[85vh] p-2 rounded-md">
          <div className="w-full h-[68vh] md:h-[80vh] overflow-y-scroll p-[1rem]">
            {messages?.map((message, index) => (
              <div
                className={`flex w-full ${
                  message?.sender?.email === faculty.email
                    ? "justify-end"
                    : "justify-start"
                }`}
                key={index}
              >
                <div className={`mt-2 relative`} style={{ maxWidth: "50rem" }}>
                  <div
                    className={`border-gray-300 border text-wrap p-[1rem] rounded-md ${
                      message?.sender?.email === faculty.email
                        ? "active-nav-elm text-white"
                        : "border-1"
                    }`}
                  >
                    <div
                      className={`text-[10px] ${
                        message?.sender?.email === faculty.email
                          ? " text-right "
                          : " text-left "
                      }`}
                    >
                      {message?.sender.email.split("@")[0]}
                    </div>
                    {message.message}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
          <div className="flex gap-2 items-center w-full  px-3 py-2">
            <textarea
              ref={textareaRef}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="inp"
              placeholder="message..."
              style={{ resize: "none", overflowY: "auto", maxHeight: "15rem" }}
              rows={1}
            />
            <Button
              className="flex items-center flex-shrink-0 px-4 py-5"
              onClick={sendMessage}
            >
              <img className="size-[1rem]" src={sendIcon} alt="Send" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FacultyClassroom;
