import React, { useState } from 'react';

const PasswordUpdate = ({ token }) => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
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
            
            setMessage('Password updated successfully!');
            setNewPassword('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="settings-panel" style={{ maxWidth: '400px', margin: '30px 0', textAlign: 'left', padding: '20px' }}>
            <h4 style={{ color: '#1e293b', marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>Security Settings</h4>
            {message && <div style={{ color: '#2f855a', marginBottom: '10px', fontSize: '14px' }}>{message}</div>}
            {error && <div className="alert-error" style={{ padding: '8px', margin: '0 0 10px 0' }}>{error}</div>}
            <form onSubmit={handlePasswordUpdate}>
                <div className="form-group" style={{ margin: '0 0 15px 0', maxWidth: '100%' }}>
                    <label>New Secret Password</label>
                    <input 
                        type="password" 
                        value={newPassword} 
                        placeholder="8-16 chars, 1 Upper, 1 Special" 
                        onChange={e => setNewPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn" style={{ margin: 0, width: 'auto', padding: '8px 16px', fontSize: '14px' }}>
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default PasswordUpdate;