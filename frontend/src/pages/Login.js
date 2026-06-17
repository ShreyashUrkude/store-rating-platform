import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);
   
    React.useEffect(() => {
     if (token && user) {
        if (user.role === 'System Administrator') navigate('/admin');
        else if (user.role === 'Store Owner') navigate('/owner');
        else navigate('/user');
     }
    }, [token, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login sequence failed');
            
            login(data.user, data.token);
            if (data.user.role === 'System Administrator') navigate('/admin');
            else if (data.user.role === 'Store Owner') navigate('/owner');
            else navigate('/user');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign In</h2>
            {error && <div className="alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" className="form-control" placeholder="name@company.com" onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? 'Verifying Credentials...' : 'Sign In'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
                New user? <Link to="/signup" style={{ color: '#3a7e7d', textDecoration: 'none' }}>Register here</Link>
            </p>
        </div>
    );
};

export default Login;