import Layout from './components/layout/layout';
import { Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/auth/SignUpPage';
import LoginPage from './pages/auth/LoginPage';
import NotificationPage from './pages/NotificationPage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import NetworkPage from './pages/NetworkPage';
import  { Toaster ,toast  } from 'react-hot-toast';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axiosInstance from './lib/axios';
import { useEffect } from 'react';


const queryClient = new QueryClient();

function AppContent() {

   

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'mydark');
  }, []);

  const { data: authUser, isLoading } = useQuery({
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

  if (isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to={'/login'} />} />
        <Route path='/network' element={authUser ? <NetworkPage /> : <Navigate to={'/login'} />} />
        <Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={'/login'} />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />

      </Routes>
      <Toaster />
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
