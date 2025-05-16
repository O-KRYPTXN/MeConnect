import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const ContactForm = ({ userData }) => {
  const [message, setMessage] = useState("");

  const {mutate: sendMessage} = useMutation({
        mutationFn: async (data) => {
            console.log("data",data);
            console.log("recipientID",userData._id);


        const res = await axiosInstance.post(`/notifications/contact/${userData._id}`, data);
        return res.data;
        },
        onSuccess: () => {
        toast.success("Message sent!");
        setMessage("");
        },
        onError: () => {
        toast.error("Failed to send message. Try again.");
        },
        });

        const handleSubmit = (e) => {
            e.preventDefault();

              if (message.trim().length < 10) {
                toast.error("Message must be at least 10 characters long.");
                return;
             }
            sendMessage({ message });
        };



  return (
    <div className="bg-[#1e1e1e] p-6 rounded-xl mt-8 shadow-lg">
      <h3 className="mb-4 text-xl font-semibold text-[#e0e0e0]">
        Send a message
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full bg-[#2a2a2a] border border-[#333] text-[#e0e0e0] p-3 rounded-md mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
