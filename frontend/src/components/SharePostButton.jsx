import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const SharePostButton = ({ postId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: sharePost, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/posts/share/${postId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Post shared successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to share post");
      setModalOpen(false);
    },
  });

  const handleConfirm = () => {
    sharePost();
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        disabled={isLoading}
        className="bg-primary text-white py-1 px-3 rounded hover:bg-primary-dark transition-colors duration-200 flex items-center"
      >
        {isLoading ? <Loader className="animate-spin mr-2" size={16} /> : "Share"}
      </button>

      <ConfirmModal
        isOpen={modalOpen}
        title="Confirm Share"
        message="Are you sure you want to share this post?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default SharePostButton;
