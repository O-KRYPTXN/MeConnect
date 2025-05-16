import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FriendRequest = ({ request }) => {
    const queryClient = useQueryClient();

	const { mutate: acceptConnectionRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("request accepted");
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
		onError: (error) => {
			toast.error(error.response.data.error);
		},
	});

	const { mutate: rejectConnectionRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success(" request rejected");
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
		onError: (error) => {
			toast.error(error.response.data.error);
		},
	});

return (
  <div className='bg-[#1e1e1e] rounded-xl shadow-md p-4 flex items-center justify-between transition-all hover:shadow-lg border border-gray-700'>
    <div className='flex items-center gap-4'>
      <Link to={`/profile/${request.sender.username}`}>
        <img
          src={request.sender.profilePic || "/avatar.png"}
          alt=':('
          className='w-16 h-16 rounded-full object-cover border border-gray-600'
        />
      </Link>

      <div>
        <Link
          to={`/profile/${request.sender.username}`}
          className='font-semibold text-lg text-gray-100 hover:underline'
        >
          {request.sender.first_name + " " + request.sender.last_name}
        </Link>
        <p className='text-gray-400 text-sm mt-1'>{request.sender.headline}</p>
      </div>
    </div>

    <div className='space-x-2'>
      <button
        className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        onClick={() => acceptConnectionRequest(request._id)}
      >
        Accept
      </button>
      <button
        className='bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors'
        onClick={() => rejectConnectionRequest(request._id)}
      >
        Reject
      </button>
    </div>
  </div>
);

}

export default FriendRequest
