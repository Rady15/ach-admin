import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for saved user session
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            const data = response.data; // Expecting { token, ...userData } or similar

            // If the API returns only a token, we might need to decode it or fetch user profile. 
            // For now, assuming the response contains user details or we can use the email.
            // We'll trust the backend response structure.

            // normalize user object
            const userData = {
                ...data,
                // Ensure we have a consistent role property if backend uses different naming
                role: data.role || (email.includes('admin') ? 'admin' : 'employee') // Fallback if role is missing (temporary)
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // Navigate based on role
            // Check for "Staff" or "Employee" (case-insensitive)
            const role = String(userData.role).toLowerCase();
            if (role === 'staff' || role === 'employee') {
                navigate('/my-tasks');
            } else {
                navigate('/dashboard');
            }

            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Invalid credentials or server error'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
