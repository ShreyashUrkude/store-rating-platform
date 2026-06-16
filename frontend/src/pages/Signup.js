import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
    const [errors, setErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors([]);
        try {
            const res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.errors) throw new Error(data.errors.map(err => err.msg).join(', '));
                throw new Error(data.message || 'Registration failure');
            }
            alert('Signup complete! Please login with your new account.');
            navigate('/login');
        } catch (err) {
            setErrors(err.message.split(', '));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: '500px' }}>
            <h2>Create An Account</h2>
            {errors.length > 0 && (
                <div className="alert-error">
                    {errors.map((err, i) => <div key={i}>{err}</div>)}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" className="form-control" placeholder="Min 20 characters, Max 60 characters" minLength={20} maxLength={60} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" className="form-control" placeholder="you@example.com" onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Physical Address</label>
                    <textarea className="form-control" placeholder="Max 400 characters" maxLength={400} style={{ height: '80px', resize: 'vertical' }} onChange={e => setFormData({...formData, address: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="8-16 chars, 1 Upper, 1 Special" onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? 'Creating Profile...' : 'Register Profile'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
                Already registered? <Link to="/login" style={{ color: '#3a7e7d', textDecoration: 'none' }}>Login here</Link>
            </p>
        </div>
    );
};

export default Signup;