import { Link } from "react-router-dom";

function UserCard({ user, isConnection }) {
  console.log(user);
return (
  <div className='bg-[#1e1e1e] rounded-lg shadow-md p-4 flex flex-col items-center transition-all hover:shadow-lg border border-gray-700'>
    <Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
      <img
        src={user.profilePic || "/avatar.png"}
        alt={user.username}
        className='w-24 h-24 rounded-full object-cover mb-4 border border-gray-600'
      />
      <h3 className='font-semibold text-lg text-center text-gray-100'>
        {user.first_name + " " + user.last_name}
      </h3>
    </Link>

    <p className='text-gray-400 text-center'>{user.headline}</p>
    <p className='text-sm text-gray-500 mt-2'>{user.connections?.length} connections</p>

    <button className='mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full'>
      {isConnection ? "Connected" : "Connect"}
    </button>
  </div>
);

}

export default UserCard;