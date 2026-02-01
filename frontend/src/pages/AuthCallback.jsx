import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUser, setToken } = useContext(AuthContext);

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Store token
            localStorage.setItem('token', token);
            setToken(token);

            // Fetch user details
            fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setUser(data);
                    toast.success('Successfully logged in! 🎉');
                    navigate('/dashboard');
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                    toast.error('Authentication failed');
                    navigate('/login');
                });
        } else {
            toast.error('Authentication failed');
            navigate('/login');
        }
    }, [searchParams, navigate, setUser, setToken]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback;