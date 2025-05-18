import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios.js";
import Sidebar from "../components/SideBar.jsx"; 
import PostCreation from "../components/PostCreation.jsx";
import Post from "../components/Post.jsx";
import RecommendedUser from "../components/RecommendedUser.jsx";
import { Users } from "lucide-react";


const HomePage = () => {
     //const queryClient = useQueryClient();

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

    const { data:recommendedUsers  } = useQuery({
      queryKey: ["recommendedUsers"],
      queryFn: async () => {
          const res = await axiosInstance.get("/users/suggestions");
          return res.data;
      }
    })

    const { data:posts  } = useQuery({
      queryKey: ["posts"],
      queryFn: async () => {
          const res = await axiosInstance.get("/posts");
          return res.data;
      }
    })

    // console.log(recommendedUsers,posts);



  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
     <div data-theme="mydark" className="hidden lg:block lg:col-span-1" >
      <Sidebar user={authUser} />
     </div>

     <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser} />

        <div className="mt-6">
          {posts?.map(post => <Post key={post._id} post={post} />) }

         {posts?.length === 0 && (
					<div className='bg-white rounded-lg shadow p-8 text-center mb-6'>
						<div className='mb-6'>
							<Users size={64} className='mx-auto text-blue-500' />
						</div>
						<h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
						<p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
					</div>
        )}

         </div>
          
         

            
       


          
       
      </div>
        {recommendedUsers?.length > 0 && (
          <div className='col-span-1 lg:col-span-1 hidden lg:block'>
            <div className='bg-[#4a5d7f] rounded-lg shadow p-4'>
              <h2 className='font-semibold text-lg text-center mb-4 border-b pb-2'>People you may know</h2>
              <div className='space-y-4'>
                {recommendedUsers.map((user) => (
                  <RecommendedUser key={user._id} user={user} />
                ))}
              </div>
            </div>
          </div>
            )}


    </div>
  )
}

export default HomePage;
