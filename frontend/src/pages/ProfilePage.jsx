import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import ContactForm from "../components/ContactForm";
import Post from "../components/Post";

import toast from "react-hot-toast";

const ProfilePage = () => {

    const { username } = useParams();
	const queryClient = useQueryClient();

        const { data: authUser ,isLoading: isAuthUserLoading } = useQuery({
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

	const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
			queryKey: ["userProfile", username],
			queryFn:async () =>{ 
				const res = await axiosInstance.get(`/users/${username}`)
				return res.data;
			},
		});

			const { data: userPosts, isLoading:isPostsLoading } = useQuery({
			queryKey: ['userPosts', userProfile?._id],
			queryFn: async () => {
				const res = await axiosInstance.get(`/posts/user/${userProfile._id}`);
				return res.data;
			},
			enabled: !!userProfile?._id, // only run query if userProfile._id exists
			});

	const { mutate: updateProfile } = useMutation({
		mutationFn: async (updatedData) => {
			await axiosInstance.put("/users/profile", updatedData);
           
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", username]);
		},
	});


	if (isAuthUserLoading || isUserProfileLoading) return null;
   

	const isOwnProfile = authUser.username === userProfile.username;
	const userData = isOwnProfile ? authUser : userProfile;
   // console.log(authUser.username, userProfile);
	const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};





  return (
		<div className='max-w-4xl mx-auto p-4 bg-[#121212] min-h-screen text-gray-100'>
			<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<EducationSection  userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			 {!isOwnProfile && <ContactForm userData={userData} />}
				
			{isPostsLoading ? (
			<p>Loading posts...</p>
			) : userPosts?.length > 0 ? (
			<div className="space-y-4 mt-6">
				{userPosts.map(post => (
				<Post key={post._id} post={post} />
				))}
			</div>
			) : (
			<p>No posts yet..</p>
			)}
		</div>
  )
}

export default ProfilePage
