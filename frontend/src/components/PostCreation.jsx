import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { Loader, Image }  from "lucide-react";



const PostCreation = ({user}) => {
    const [content,setContent] = useState('');
    const [image,setImage] = useState(null);
    const [imagePreview,setImagePreview] = useState(null);

    const queryClient = useQueryClient();

    const { mutate: createPostMutation, isPending} = useMutation({
        mutationFn: async (postData) => {
            const res = await axiosInstance.post("/posts/create", postData ,{
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return res.data;
        },
        onSuccess: () => {
            resetForm();
            toast.success("Post created successfully");
           queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (err) => {
            toast.error(err.response.data.message || "failed to crate post");
        },
    });

    const handlePostCreation =async (e) => {
        e.preventDefault();

         if (!content.trim() && !image) {
            toast.error("Please write something or add an image before posting.");
            return;
            }

        try {
            const postData = {
                content,
                
            };
            if(image){
                postData.image = await readFileAsDataUrl(image);
            }

            createPostMutation(postData);
            
        } catch (error) {
            console.log(error ,"error in handlePostCreation");
        }

    };
    const resetForm = () => {
        setContent("");
        setImage(null);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            readFileAsDataUrl(file).then(setImagePreview)  

        }else{
            setImagePreview(null);
        } 
    };

    const readFileAsDataUrl = (file) => {
        return new Promise((resolve , reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="bg-[#3a3a5a] rounded-lg shadow mb-4 p-4">
            <div className="flex space-x-3">
            <img src={user.profilePic || "/avatar.png"} alt={user.username} className="size-10 rounded-full" />
            <textarea 
                placeholder="What's on your mind?"
                className="w-full focus:outline-none p-3 rounded-lg bg-base-100 hover:bg-base-200 
                resize-none transition-colors duration-200 min-h-[100px] " 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                />
            </div>
            {imagePreview && (
                <div className="mt-4">
                    <img src={imagePreview} alt="Preview" className="w-full rounded-lg" />
                </div>
            )}
            <div className="flex justify-between mt-4 items-center">
               <div className="flex space-x-4">
                <label className="cursor-pointer flex items-center text-info hover:text-info-dark transition-colors duration-200">
                    <Image size={15} className="mr-2"/>
                    <span>Photos</span>
                    <input type="file" className="hidden" accept='image/*' onChange={handleImageChange} />
                </label>
                </div>
                <button
                    className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200"
                    onClick={handlePostCreation}
                    disabled={isPending}
                >
                    {isPending ? <Loader className="animate-spin" /> : "Post"}
                </button>
            </div>                   
        </div>
    )
}   

export default PostCreation;