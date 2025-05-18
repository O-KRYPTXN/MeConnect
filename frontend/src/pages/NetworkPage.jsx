import { useQuery  } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import {  UserPlus  } from 'lucide-react';
import FriendRequest from '../components/FriendRequest';
import UserCard from '../components/UserCard';
import Sidebar from '../components/SideBar';
import Search from '../components/Search';



const NetworkPage = () => {
    

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

        const { data: connectionRequests } = useQuery({
                queryKey: ["connectionRequests"],
                queryFn: async () => {
                    const res = await axiosInstance.get("/connections/requests");
                    return res.data; 
                },
        });
          const { data: connections } = useQuery({
                queryKey: ["connections"],
                queryFn: async () => {
                    const res = await axiosInstance.get("/connections");
                    return res.data; 
                },
        });







return (
  <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
    <div className='col-span-1 lg:col-span-1'>
      <Sidebar user={authUser} />
    </div>

    <div className='col-span-1 lg:col-span-3'>
      <div className='bg-[#1e1e1e] rounded-lg shadow-md p-6 mb-6 border border-gray-700'>
        <h1 className='text-2xl font-bold mb-6 text-gray-100'></h1>

        <Search authUser={authUser} />

        {connectionRequests?.length > 0 ? (
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-2 text-gray-200'>Connection Request</h2>
            <div className='space-y-4'>
              {connectionRequests.map((request) => (
                <FriendRequest key={request.id} request={request} />
              ))}
            </div>
          </div>
        ) : (
          <div className='bg-[#2a2a2a] rounded-lg shadow-md p-6 text-center mb-6 border border-gray-700'>
            <UserPlus size={48} className='mx-auto text-gray-500 mb-4' />
            <h3 className='text-xl font-semibold mb-2 text-gray-100'>No Connection Requests</h3>
            <p className='text-gray-400'>
              You don&apos;t have any pending connection requests at the moment.
            </p>
            <p className='text-gray-400 mt-2'>
              Explore suggested connections below to expand your network!
            </p>
          </div>
        )}

        {connections?.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-gray-200'>My Connections</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {connections.map((connection) => (
                <UserCard key={connection._id} user={connection} isConnection={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

}

export default NetworkPage
