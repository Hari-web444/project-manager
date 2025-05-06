import React, { useState, useRef } from 'react';
import SvgContent from '../components/svgcontent';
import { useNavigate } from 'react-router-dom';
import configModule from '../../config.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const config = configModule.config();

    const isSubmitting = useRef(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (isSubmitting.current) return;
        isSubmitting.current = true;

        setLoading(true);

        if (!username || !password) {
            toast.error("All fields required");
            setLoading(false);
            isSubmitting.current = false;
            return;
        }

        try {
            const response = await fetch(`${config.apiBaseUrl}login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok && result.data && result.data[0]) {
                toast.success(result.message);
                localStorage.setItem("token", result.data[0]);
                localStorage.setItem("user_typecode", result.data[0].user_typecode);
                localStorage.setItem("userId", result.data[0].user_id);
                localStorage.setItem("usertype_id", result.data[0].usertype_id);

                setTimeout(() => {
                    navigate('/dashboard', { state: result.data[0] });
                    
                    setUsername('');
                    setPassword('');
                }, 3000);
            } else {
                toast.error(result.message || "Login error");
                setLoading(false);
                isSubmitting.current = false;
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred");
            setLoading(false);
            isSubmitting.current = false;
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="mb-5">
                <label htmlFor="user" className="form-label mb-3 admin-label">Username</label>
                <input
                    type="text"
                    className="admin-input"
                    id="user"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                />
            </div>
            <div className="mb-2 position-relative">
                <label htmlFor="password" className="form-label mb-3 admin-label">Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    className="admin-input"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />
                <span
                    className="toggle-password"
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <SvgContent svg_name="eyeclose" /> : <SvgContent svg_name="eyeopen" />}
                </span>
            </div>

            <button
                type="button"
                className="forgot"
                onClick={() => navigate('/forgot-password')}
            >
                Forgot password?
            </button>

            <button
                type="submit"
                className="btn btn-primary admin-button"
                disabled={loading}
            >
                {loading ? <span className="button-animate">Logging in...</span> : "Login"}
            </button>
        </form>
    );
};

export default LoginPage;
