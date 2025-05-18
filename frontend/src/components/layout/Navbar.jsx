import { useMutation, useQuery , useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../../lib/axios"
import { toast } from "react-hot-toast"
import { Link } from "react-router-dom"
import {Home ,Bell ,Users ,LogOut ,User } from "lucide-react"

const Navbar = () => {
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
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    },
  });

  const {data:notifications} = useQuery({
    queryKey:["notifications"],
    queryFn:async() => {const res = await axiosInstance.get("/notifications") 
    return res.data;} ,
    enabled:!!authUser
  })

  const {data:connectionRequests} = useQuery({
    queryKey:["connectionRequests"],
    queryFn: async() => {const res = await axiosInstance.get("/connections/requests")
    return res.data
    } ,
    enabled:!!authUser
  })

  const {mutate:logout} = useMutation({
     mutationFn:()=> axiosInstance.post("/auth/logout"),
     onSuccess:()=> {
      queryClient.invalidateQueries({queryKey:["authUser"]})
      //navigate("/login");
     }
  })

   //   const unreadNotificationsCount = notifications?.filter((n) => !n.read).length || 0;
  //   const unreadConnectionRequestsCount = connectionRequests?.filter((n) => !n.accepted && !n.rejected).length || 0;
 //const unreadConnectionRequestsCount = connectionRequests?.length || 0;
	const unreadNotificationsCount = Array.isArray(notifications)
	? notifications.filter((n) => !n.read).length
	: 0;

	const unreadConnectionRequestsCount = Array.isArray(connectionRequests)
	? connectionRequests.filter((n) => !n.accepted && !n.rejected).length
	: 0;
	
  return (
   <nav data-theme='mydark' className='bg-[#2a2a3f] shadow-md sticky top-0 z-10'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					<div className='flex items-center space-x-4'>
						<Link to='/'>
							<img className='h-12 rounded' src='/home-logo.png' alt='Meconnect' />
						</Link>
					</div>
					<div className='flex items-center gap-2 md:gap-6'>
						{authUser ? (
							<>
								<Link to={"/"} className='text-neutral flex flex-col items-center'>
									<Home size={20} color="white" />
									<span className='text-xs hidden md:block text-white'>Home</span>
								</Link>
								<Link to='/network' className='text-neutral flex flex-col items-center relative'>
									<Users size={20} color="white" />
									<span className='text-xs hidden md:block text-white'>My Network</span>
									{unreadConnectionRequestsCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadConnectionRequestsCount}
										</span>
									)}
								</Link>
								<Link to='/notifications' className='text-neutral flex flex-col items-center relative'>
									<Bell size={20} color="white"/>
									<span className='text-xs hidden md:block text-white'>Notifications</span>
									{unreadNotificationsCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadNotificationsCount}
										</span>
									)}
								</Link>
								<Link
									to={`/profile/${authUser.username}`}
									className='text-neutral flex flex-col items-center'
								>
									<User size={20} color="white" />
									<span className='text-xs hidden md:block text-white'>Me</span>
								</Link>
								<button
									className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
									onClick={() => logout()}
								>
									<LogOut size={20} color="white"  />
									<span className='hidden md:inline text-white'>Logout</span>
								</button>
							</>
						) : (
							<>
								<Link to='/login' className='btn btn-ghost'>
									Sign In
								</Link>
								<Link to='/signup' className='btn btn-primary'>
									Join now
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
  )
}

export default Navbar;
