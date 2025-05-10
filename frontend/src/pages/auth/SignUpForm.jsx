import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { data } from 'react-router-dom';
import {axiosInstance} from "../../lib/axios.js";
import {toast} from "react-hot-toast";
import {Loader} from "lucide-react";

const SignUpForm = () => {
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");

    const {mutate: signUpMutation, isLoading}=useMutation({
        mutationFn: async(data)=>{
            const res=await axiosInstance.post("/auth/signup",data)
            return res.data
        },
        onSuccess:()=>{
            toast.success("Acount created sucessfully")
        },
        onError:()=>{
            toast.error("There is something wrong")
        },
    })
    const handlesignup=(e)=>{
        e.preventDefault();
        signUpMutation({name,email,username,password});
    }
  return(
  <form onSubmit={handlesignup} className='flex flex-col gap-3'>
    <div>
        <input type="text"
            placeholder='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='input input-bordered w-full'
            required
        />
    </div>
    <div>
        <input type="text"
            placeholder='UserName'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='input input-bordered w-full'
            required
        />
    </div>
    <div>
        <input type="email"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input input-bordered w-full'
            required
        />
    </div>
    <div>
        <input type="password"
            placeholder='Password (6+ characters)'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input input-bordered w-full'
            required
        />
    </div>
    <button type='submit' disabled={isLoading} className='btn btn-primary w-full text-white'>
        {isLoading ? <Loader className="size-5 animate-spin" /> : "Agree & Join"}
    </button>
  </form>
  )
}

export default SignUpForm;