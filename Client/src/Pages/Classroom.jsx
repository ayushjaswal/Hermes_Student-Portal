import AsideNav from "@/components/AppComponents/AsideNav";
import { config, path } from "@/path";
import { useEffect, useRef, useState } from "react";
import socketService from "@/lib/socketService";
import { Button } from "@/components/ui/button";
import sendIcon from "../assets/send.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addClassroom } from "@/store/features/classroom";
import { toast, Toaster } from "sonner";
import React from "react";
const Classroom = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const classroom = useSelector((state) => state.classroom);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const endOfMessagesRef = useRef(null);
  const textareaRef = useRef(null);
  useEffect(() => {
    setMessages(classroom.messages);
  }, [classroom]);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const response = await axios.get(
          `${path}/class/room/${user.classroom}`,
          config
        );
        if (response.data) {
          dispatch(addClassroom(response.data));
        } else {
          toast.error("Failed to fetch classroom");
        }
      } catch (error) {
        toast.error("Error fetching classroom");
        console.error(error);
      }
    };
    fetchClassroom();

    socketService.connect(user.classroom, user._id);

    socketService.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketService.onDisconnect(() => {
      console.log("Disconnected from socket");
    });

    return () => {
      socketService.disconnect();
    };
  }, [dispatch, user.classroom]);

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
        roomId: user.classroom,
        message: inputMessage,
        senderEmail: user.email,
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
            {messages.map((message, index) => {
              // Get the message date
              const messageDate = new Date(
                message.createdAt
              ).toLocaleDateString();
              // Get the previous message date if it exists
              const prevMessageDate =
                index > 0
                  ? new Date(messages[index - 1].createdAt).toLocaleDateString()
                  : null;

              const messageTime = new Date(
                message.createdAt
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              console.log(messageTime);
              return (
                <React.Fragment key={index}>
                  {messageDate !== prevMessageDate && (
                    <div className="text-center w-full text-xs text-gray-500 mb-2 px-3 py-1 ">
                      {new Date().toLocaleDateString() === messageDate ? (
                        <div>
                          <hr className="border-t border-gray-200 mt-2" />
                          <div className="inline-block bg-blue-100 rounded-full px-3 py-1 shadow-sm mt-2">
                            Today
                          </div>
                        </div>
                      ) : (
                        <div className="inline-block bg-blue-100 rounded-full px-3 py-1 shadow-sm  ">
                          {messageDate}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`flex w-full  ${
                      message?.sender?.email === user.email
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className="mt-2 relative"
                      style={{ maxWidth: "50rem" }}
                    >
                      <div
                        className={`border-gray-300 border text-wrap  rounded-md  ${
                          message?.sender?.email === user.email
                            ? "active-nav-elm text-white"
                            : "border-1"
                        }`}
                      >
                        <div
                          className={`text-[10px] rounded-t-md px-2 py-1 ${
                            message?.sender?.email === user.email
                              ? "text-right bg-gradient-to-r from-sky-500 to-blue-500 "
                              : "text-left bg-gray-200"
                          }`}
                        >
                          {message?.sender.email?.split("@")[0]}
                        </div>
                        <div className="pt-2 px-2">{message.message}</div>
                        <div
                          className={`text-[10px] p-2 ${
                            message.sender.email === user.email
                              ? " text-right "
                              : " text-left "
                          }
                          `}
                        >
                          {messageTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
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

export default Classroom;
