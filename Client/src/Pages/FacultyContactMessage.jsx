import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import AsideNav from "@/components/AppComponents/AsideNav";
import { config, path } from "@/path";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

const FacultyContactMessage = () => {
  const { messageId } = useParams();
  const faculty = useSelector((state) => state.faculty);
  const [contactMessage, setContactMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchContactMessage = async () => {
      try {
        const response = await axios.get(
          `${path}/contact/get-contact-message/${messageId}`,
          config
        );
        setContactMessage(response.data);
        setReplies(response.data.replies);
      } catch (error) {
        toast.error("Failed to fetch contact message");
        console.log(error);
      }
    };
    fetchContactMessage();
  }, [messageId]);

  const replyMessage = async () => {
    try {
      const data = { sender: faculty._id, content: reply, messageId };
      const replyDb = await axios.post(
        `${path}/contact/create-contact-reply`,
        data,
        config
      );

      if (replyDb.data) {
        setReplies((prev) => [...prev, replyDb.data]);
        toast.success("Reply sent!");
        setReply("");
      } else {
        toast.error("Failed to send reply!");
      }
    } catch (error) {
      toast.error("Error sending reply");
      console.error(error);
    }
  };

  return (
    <div className="md:flex min-h-screen">
      <AsideNav />
      <Toaster richColors position="bottom-center" />
      <section className="flex-1 mx-4 mt-6 flex flex-col gap-6 w-full">
        <div className="title w-full">Contact Messages</div>

        <div className="h-[55vh] overflow-y-scroll border p-2 rounded-md shadow-sm">
          <div className="p-4 border rounded-md shadow-md bg-white ">
            <div className="text-sm text-gray-500 mb-2">
              <p className="flex gap-2 items-center">
                <img
                  className="size-[2rem] rounded-full object-cover"
                  src={contactMessage?.sender?.avatar}
                />
                {contactMessage?.sender?.name} ({contactMessage?.sender?.email})
              </p>
            </div>
            {contactMessage?.closedCaptions?.length > 0 && (
              <div className="mt-2">
                <strong>Closed Captions:</strong>
                <ul>
                  {contactMessage.closedCaptions.map((cc) => (
                    <li key={cc._id}>
                      {cc.name} ({cc?.email})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2">
              {contactMessage?.messageSubject}
            </h2>
            <div className="text-gray-700 mb-4">
              {contactMessage?.message ? parse(contactMessage?.message) : ""}
            </div>

            {contactMessage?.attachments?.length > 0 && (
              <div className="mt-4">
                <strong>Attachments:</strong>
                <ul>
                  {contactMessage.attachments.map((attachment, index) => (
                    <li key={index}>
                      <a
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Attachment {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="replies mt-4 pl-10">
            <div className="text-xl font-medium px-1">Replies</div>
            {replies.map((reply) => (
              <div
                key={reply._id}
                className="reply p-4 border rounded-md shadow-md bg-white mb-2"
              >
                <div className="text-sm text-gray-500 mb-2">
                  <p className="flex gap-2 items-center">
                    <img
                      className="size-[2rem] rounded-full object-cover"
                      src={reply?.sender?.avatar}
                    />
                    {reply?.sender?.name} ({reply?.sender?.email})
                  </p>
                </div>
                <div className="text-gray-700 mb-4">
                  {reply.content ? parse(reply.content) : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Reply</h3>
          <ReactQuill
            value={reply}
            onChange={(content) => setReply(content)}
            className="mb-4"
          />
          <Button onClick={replyMessage} className="btn">
            Send Reply
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FacultyContactMessage;
