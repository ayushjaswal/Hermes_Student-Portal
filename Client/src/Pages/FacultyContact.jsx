import AsideNav from "@/components/AppComponents/AsideNav";
import { config, path } from "@/path";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import msgSeen from "../assets/envelop-open.svg";
import msgNotSeen from "../assets/envelop-close.svg";

const FacultyContact = () => {
  const faculty = useSelector((state) => state.faculty);
  const [contactMessages, setContactMessages] = useState([]);
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState([]);

  useEffect(() => {
    const fetchContactMessages = async () => {
      try {
        const contactMessages = await axios.get(
          `${path}/contact/fetch-contact-messeges/${faculty._id}`,
          config
        );
        setContactMessages(contactMessages.data);
        setUnreadMessages(contactMessages.data.filter((msg) => !msg.isRead));
      } catch (e) {
        toast.error("Failed to fetch contact messages");
        console.error(e);
      }
    };
    fetchContactMessages();
  }, [faculty]);

  return (
    <div className="md:flex min-h-screen ">
      <AsideNav />
      <section className="flex-1 mx-4 mt-6 flex flex-col gap-6 w-full">
        <Toaster richColors position="bottom-center" />
        <div className="title w-full">
          Contact Messages 
          {unreadMessages.length > 0
            ? ` (${unreadMessages.length} unread )`
            : ""}
        </div>
        <div className="flex flex-col gap-2 ">
          {contactMessages.map((msg) => (
            <div
              className={`p-2 rounded-md border border-1 flex justify-between items-center  cursor-pointer hover:bg-gray-300 transition ease-in-out${
                msg.isRead ? " " : " bg-gray-200  "
              }
              `}
              onClick={() => navigate(`/forum-messages/${msg._id}`)}
              key={msg._id}
            >
              <div className="flex gap-2 items-center">
                <img
                  src={msg.sender?.avatar}
                  className="w-[3rem] h-[3rem] object-cover border rounded-full"
                />
                <div className="">
                  <div className="text-xl font-semibold">
                    {msg.sender?.name}
                  </div>
                  <div
                    className={`${msg.isRead ? "font-normal" : "font-medium"} `}
                  >
                    {msg.messageSubject}
                  </div>
                </div>
              </div>
              <div>
                <img
                  className="size-[1.5rem]"
                  src={msg.isRead ? msgSeen : msgNotSeen}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FacultyContact;
