import { useQuery , useQueryClient , useMutation } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { toast } from 'react-hot-toast';
import { UserPlus ,MessageSquare ,ThumbsUp ,Trash2 ,ExternalLink , Eye , Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import { formatDistanceToNow } from 'date-fns';

const NotificationPage = () => {

    const queryClient = useQueryClient();

    const { data: authUser } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return null;
        }
        //toast.error(error.response?.data?.message || 'Something went wrong');
      }
    },
  });

            const { data: notifications, isLoading: isloading } = useQuery({
            queryKey: ["notifications"],
            queryFn: async () => {
                const res = await axiosInstance.get("/notifications");
                return res.data; // <- critical
            },
            });

        
        const { mutate: markAsReadMutation } = useMutation({
            mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
            onSuccess: () => {
                queryClient.invalidateQueries(["notifications"]);
            },
        });

        const { mutate: deleteNotificationMutation } = useMutation({
            mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
            onSuccess: () => {
                queryClient.invalidateQueries(["notifications"]);
                toast.success("Notification deleted");
            },
        });

        const renderNotificationIcon = (type) => {
          switch (type) {
            case "like":
              return <ThumbsUp className="text-blue-500" />;

            case "comment":
              return <MessageSquare className="text-green-500" />;

            case "connectionAccepted":
              return <UserPlus className="text-purple-500" />;

            case "message":
              return <Mail className="text-yellow-500" />;  // icon for message notification
            
            case "share":
              return <ExternalLink className="text-pink-500" />;
            default:
              return null;
          }
        };

      
        	const renderNotificationContent = (notification) => {
              switch (notification.type) {
                case "like":
                  return (
                    <Link to={`/profile/${notification.relatedUser.username}`}>
                    <span>
                      <strong>{notification.relatedUser.first_name + " " + notification.relatedUser.last_name}</strong> liked your post
                    </span>
                    </Link>
                  );
                case "comment":
                  return (
                    <span>
                      <Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
                        {notification.relatedUser.first_name + " " + notification.relatedUser.last_name}
                        
                      </Link>{" "}
                      commented on your post
                    </span>
                  );
                case "connectionAccepted":
                  return (
                    <span>
                      <Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
                        {notification.relatedUser.first_name + " " + notification.relatedUser.last_name}
                      </Link>{" "}
                      accepted your connection request
                    </span>
                  );
                   case "message":
                    return (
                      <span>
                        <Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
                          {notification.relatedUser.first_name + " " + notification.relatedUser.last_name}
                        </Link>{" "}
                          
                        sent you a message: <em>"{notification.messageContent}"</em>
                        {console.log(notification)}
                      </span>
                    );
                    case "share":
                  return (
                    <span>
                      <Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
                        {notification.relatedUser.first_name + " " + notification.relatedUser.last_name}
                        
                      </Link>{" "}
                      shared your post
                    </span>
                  );
                default:
                  return null;
              }
	};

    	const renderRelatedPost = (relatedPost) => {
        if (!relatedPost) return null;

        return (
          <Link
            to={`/post/${relatedPost._id}`}
            className='mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors'
          >
            {relatedPost.image && (
              <img src={relatedPost.image} alt='Post preview' className='w-10 h-10 object-cover rounded' />
            )}
            <div className='flex-1 overflow-hidden'>
              <p className='text-sm text-gray-600 truncate'>{relatedPost.content.slice(0,25) + "..."}</p>
            </div>
            <ExternalLink size={14} className='text-gray-400' />
          </Link>
        );
	};



return (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <div className="col-span-1">
      <Sidebar user={authUser} />
    </div>
    <div className="col-span-1 lg:col-span-3">
      <div className="bg-[#1f1f1f] rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-100">Notifications</h1>

        {isloading ? (
          <p className="text-gray-400">Loading notifications...</p>
        ) : notifications && notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-5 border rounded-xl shadow-sm transition-all hover:shadow-md bg-[#2a2a2a] ${
                  !notification.read ? "border-blue-500/40" : "border-gray-700"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-4">
                    <Link to={`/profile/${notification.relatedUser.username}`}>
                      <img
                        src={notification.relatedUser.profilePic || "/avatar.png"}
                        alt={notification.relatedUser.username}
                        className="w-12 h-12 rounded-full object-cover shadow"
                      />
                    </Link>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className="p-1.5 bg-[#3a3a3a] rounded-full shadow-sm">
                          {renderNotificationIcon(notification.type)}
                        </div>
                        <p className="text-sm text-gray-200">
                          {renderNotificationContent(notification)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      {renderRelatedPost(notification.relatedPost)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsReadMutation(notification._id)}
                        className="p-2 bg-blue-600/20 text-blue-400 rounded-full hover:bg-blue-600/30 transition"
                        aria-label="Mark as read"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotificationMutation(notification._id)}
                      className="p-2 bg-red-600/20 text-red-400 rounded-full hover:bg-red-600/30 transition"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p className="text-lg">You're all caught up!</p>
            <p className="text-sm mt-2">No new notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

}

export default NotificationPage
