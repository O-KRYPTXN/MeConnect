import { useState } from 'react'
import { useMutation, QueryClientProvider , useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {axiosInstance} from '../../lib/axios.js'
import { Loader} from 'lucide-react' 


const SignUpForm = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const queryClient = useQueryClient();

	const { mutate: signUpMutation , isLoading } = useMutation({
		mutationFn: async (data) => {
			const res = await axiosInstance.post("/auth/signup", data);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Something went wrong");
		},
	});
    const handleSignUp = (e) => {
        e.preventDefault()
        signUpMutation({
			first_name:firstName,
			last_name:lastName,
			username,
			email,
			password
		})
    }

  return (
    <form onSubmit={handleSignUp} className='flex flex-col gap-3'>
        <input
				type='text'
				placeholder='First name'
				value={firstName}
				onChange={(e) => setFirstName(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
            <input
				type='text'
				placeholder='Last name'
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='text'
				placeholder='Username'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password (6+ characters)'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>

			<button type='submit'disabled={isLoading}  className='btn btn-primary w-full text-white'>
				{isLoading ? <Loader className='size-5 animate-spin' /> : "Join"}
			</button>        
    </form>
  )

}

export default SignUpForm;
