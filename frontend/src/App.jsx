import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import SignUpPage from "./pages/auth/SignUpPage"; 
import LoginPage from "./pages/auth/LoginPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";

function App() {
  const {data:authUser} = useQuery({
    queryKey:['authUser'],
    queryFn:async()=>{
      try{
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      }catch(err){
        if(err.response && err.response.status===401){
          return null;
        }
        toast.error(err.response.data.message || "there is something wrong");
      }
    }
  });
  console.log("authuser",authUser);
  return <Layout>
    <Routes>
      <Route 
        path="/" 
        element={authUser ? <HomePage /> : <Navigate to="/login" replace />} 
      />     
      <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
      <Route path='/login' element={!authUser ?<LoginPage />: <Navigate to={"/"} />} />
    </Routes>
    <Toaster />
  </Layout>;
}

export default App;