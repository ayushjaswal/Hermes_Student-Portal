import React, { useState, useEffect } from "react";
import axios from "axios";
import AsideNav from "../components/AppComponents/AsideNav";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import { config, path } from "@/path";
import { useSelector } from "react-redux";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import { useLocation } from "react-router-dom";

const ForumPage = () => {
  const location = useLocation();
  const { selectedTeacher } = location.state || {};
  const studentId = useSelector((state) => state.user._id);
  const [formData, setFormData] = useState({
    facultyEmail: "",
    ccEmail: [],
    subject: "",
    content: "",
  });
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(
    selectedTeacher?._id ? selectedTeacher?._id : ""
  );
  const [closedCaptioOptions, setClosedCaptionOptions] = useState([]);

  useEffect(() => {
    const fetchFacultyOptions = async () => {
      try {
        const response = await axios.get(
          `${path}/auth/get-faculty/${studentId}`,
          config
        );
        setFacultyOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch faculty options", error);
      }
    };
    fetchFacultyOptions();
  }, [studentId]);

  useEffect(() => {
    setClosedCaptionOptions(
      facultyOptions.filter((value) => value._id !== selectedFaculty)
    );
  }, [facultyOptions, selectedFaculty]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, facultyEmail: selectedFaculty }));
  }, [selectedFaculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      recieverId: formData.facultyEmail,
      senderId: studentId,
      message: formData.content,
      messageSubject: formData.subject,
      closedCaptions: formData.ccEmail.map((faculty) => faculty._id),
    };
    console.log("Form Submitted:");
    try {
      const sendForm = await axios.post(
        `${path}/contact/create-contact-messege`,
        data,
        config
      );
      if (sendForm.data) {
        toast.success("Your message has been sent!");
        setFormData({
          facultyEmail: "",
          ccEmail: [],
          subject: "",
          content: "",
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Error creating contact: " + e.message);
    }
  };

  const handleCCChange = (faculty) => {
    setFormData((prevFormData) => {
      if (!prevFormData.ccEmail.some((email) => email._id === faculty._id)) {
        return {
          ...prevFormData,
          ccEmail: [...prevFormData.ccEmail, faculty],
        };
      }
      return prevFormData;
    });
  };

  const handleRemoveCC = (faculty) => {
    setFormData((prevFormData) => {
      const updatedCCEmails = prevFormData.ccEmail.filter(
        (email) => email._id !== faculty._id
      );
      return { ...prevFormData, ccEmail: updatedCCEmails };
    });
  };

  return (
    <div className="md:flex min-h-screen ">
      <AsideNav className="fixed top-0 left-0 w-1/4 h-full bg-gray-800 text-white" />
      <Toaster richColors position="bottom-center" />
      <div className="flex-1 mx-4 mt-6 flex flex-col gap-6">
        <div className="contact-faculty">
          <div className="text-3xl font-bold text-gray-900 mb-8">
            Contact Faculty
          </div>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="form-group mb-4">
              <label className="block mb-2 text-gray-700">
                Email of Faculty:
              </label>

              <Select
                value={selectedFaculty}
                onValueChange={setSelectedFaculty}
              >
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent className="w-full ">
                  {facultyOptions.map((faculty) => (
                    <SelectItem key={faculty._id} value={faculty._id}>
                      {faculty.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="form-group mb-4">
              <label className="mb-2 text-gray-700 flex gap-2 ">
                CC (optional):
                <div className="flex gap-2">
                  {formData.ccEmail.map((val) => (
                    <div
                      onClick={() => handleRemoveCC(val)}
                      className="border px-2 rounded-full text-xs flex items-center hover:bg-gray-100 transition ease-in-out cursor-pointer"
                      key={val?._id}
                    >
                      {val.email?.substr(0, 10)}...
                    </div>
                  ))}
                </div>
              </label>
              <DropdownMenu className="w-full justify-start">
                <DropdownMenuTrigger className="w-full text-left text-[14px] p-2 rounded-md border shadow-sm">
                  Select Faculty
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full text-left text-[14px] p-2 rounded-md border shadow-sm">
                  {closedCaptioOptions.map((faculty) => (
                    <DropdownMenuItem
                      key={faculty._id}
                      onClick={() => handleCCChange(faculty)}
                      className="w-full"
                    >
                      {faculty.email}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="form-group mb-4">
              <label className="block mb-2 text-gray-700">Subject:</label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Subject"
                className="inp w-full"
              />
            </div>

            <div className="form-group mb-4">
              <label className="block mb-2 text-gray-700">Message:</label>
              <ReactQuill
                value={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
                className="mb-4"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full btn">
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
