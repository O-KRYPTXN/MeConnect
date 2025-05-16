import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../../lib/axios"
import { toast } from "react-hot-toast"
import { Loader } from "lucide-react"

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const queryClient = useQueryClient();

    const { mutate: loginMutation, isLoading } = useMutation({
        mutationFn:(userData)=> axiosInstance.post("/auth/login",userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (err) => {
            toast.error(err.response.data.message || "Something went wrong");
        },
    });
    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation({ email, password });
    };
    return(
        <form onSubmit={handleLogin} className='space-y-4 w-full max-w-md'>
			<input
				type='text'
				placeholder='email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>

			<button type='submit' className='btn btn-primary w-full'>
				{isLoading ? <Loader className='size-5 animate-spin' /> : "Login"}
			</button>
		</form>
    )
    

    
}

export default LoginForm;