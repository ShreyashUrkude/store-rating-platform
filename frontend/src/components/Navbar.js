import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    if (!user) return null;

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 25px', background: '#ffffff', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>Active User Session: <strong style={{ color: '#3a7e7d' }}>{user.name}</strong> <span className="badge owner">{user.role}</span></span>
            <button onClick={logout} style={{ margin: 0, padding: '6px 14px', fontSize: '13px', width: 'auto' }}>Disconnect Session</button>
        </nav>
    );
};

export default Navbar;