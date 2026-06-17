import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, token, logout } = useContext(AuthContext);
    const [showPassForm, setShowPassForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');

    if (!user) return null;

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMsg('');
        setErr('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || (data.errors && data.errors[0].msg) || 'Update failed');
            
            setMsg('Password updated successfully!');
            setNewPassword('');
            setTimeout(() => { setShowPassForm(false); setMsg(''); }, 2000);
        } catch (err) {
            setErr(err.message);
        }
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', background: '#ffffff', borderBottom: '2px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '15px', fontWeight: '600' }}>
                    Logged in as: <strong style={{ color: '#3a7e7d' }}>{user.name}</strong> <span className="badge owner">{user.role}</span>
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setShowPassForm(!showPassForm)} 
                        style={{ margin: 0, padding: '6px 14px', fontSize: '13px', width: 'auto', backgroundColor: '#475569' }}
                    >
                        {showPassForm ? 'Cancel' : 'Change Password'}
                    </button>
                    <button 
                        onClick={logout} 
                        style={{ margin: 0, padding: '6px 14px', fontSize: '13px', width: 'auto', backgroundColor: '#c53030' }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {showPassForm && (
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', marginTop: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '320px', marginLeft: 'auto' }}>
                    <h5 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Update Credentials</h5>
                    {msg && <div style={{ color: '#2f855a', fontSize: '13px', marginBottom: '10px' }}>{msg}</div>}
                    {err && <div style={{ color: '#c53030', fontSize: '13px', marginBottom: '10px' }}>{err}</div>}
                    <form onSubmit={handlePasswordUpdate}>
                        <input 
                            type="password" 
                            placeholder="8-16 chars, 1 Upper, 1 Special" 
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            style={{ padding: '6px 10px', fontSize: '14px', marginBottom: '10px', maxWidth: '100%' }}
                            required 
                        />
                        <button type="submit" style={{ margin: 0, padding: '6px 12px', fontSize: '13px', width: '100%' }}>
                            Save New Password
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Navbar;