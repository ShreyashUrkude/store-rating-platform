import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [stores, setStores] = useState([]);
    const [users, setUsers] = useState([]);
    const [storeSearch, setStoreSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [storeSort, setStoreSort] = useState({ field: 'name', order: 'ASC' });
    const [userSort, setUserSort] = useState({ field: 'name', order: 'ASC' });
    const [storesLoading, setStoresLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);

    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
    const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });

    const loadStats = () => {
        fetch('http://localhost:5000/api/admin/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json()).then(data => setStats(data)).catch(err => console.error(err));
    };

    useEffect(() => {
        loadStats();
    }, [token]);

    useEffect(() => {
        setStoresLoading(true);
        fetch(`http://localhost:5000/api/admin/stores-list?search=${storeSearch}&sortBy=${storeSort.field}&order=${storeSort.order}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).then(data => { setStores(data); setStoresLoading(false); });
    }, [storeSearch, storeSort, token]);

    useEffect(() => {
        setUsersLoading(true);
        fetch(`http://localhost:5000/api/admin/users-list?search=${userSearch}&sortBy=${userSort.field}&order=${userSort.order}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).then(data => { setUsers(data); setUsersLoading(false); });
    }, [userSearch, userSort, token]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(userForm)
        });
        if (res.ok) {
            alert('User provisioned successfully!');
            setUserForm({ name: '', email: '', password: '', address: '', role: 'Normal User' });
            loadStats();
        }
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/admin/stores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(storeForm)
        });
        if (res.ok) {
            alert('Store provisioned successfully!');
            setStoreForm({ name: '', email: '', address: '', ownerId: '' });
            loadStats();
        }
    };

    const toggleSort = (type, field) => {
        if (type === 'store') {
            setStoreSort(prev => ({ field, order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC' }));
        } else {
            setUserSort(prev => ({ field, order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC' }));
        }
    };

    return (
        <div className="dashboard-container">
            <h2>System Administration Management</h2>
            
            <div className="stats-grid">
                <div className="stats-card">
                    <h4>Total Registered Users</h4>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stats-card">
                    <h4>Total Stores Registered</h4>
                    <p>{stats.totalStores}</p>
                </div>
                <div className="stats-card">
                    <h4>Total Processed Ratings</h4>
                    <p>{stats.totalRatings}</p>
                </div>
            </div>

            <div className="settings-panel" style={{ maxWidth: '100%', display: 'flex', gap: '30px', flexWrap: 'wrap', textAlign: 'left', marginBottom: '30px' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                    <h3 style={{ color: '#1e293b', border: 'none', padding: 0, marginBottom: '15px' }}>Provision New Profile</h3>
                    <form onSubmit={handleCreateUser}>
                        <div className="form-group" style={{ maxWidth: '100%' }}>
                            <label>Full Identity Name</label>
                            <input type="text" className="form-control" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{ maxWidth: '100%' }}>
                            <label>Email Address</label>
                            <input type="email" className="form-control" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{ maxWidth: '100%' }}>
                            <label>Location Address</label>
                            <input type="text" className="form-control" value={userForm.address} onChange={e => setUserForm({...userForm, address: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{ maxWidth: '100%' }}>
                            <label>Password</label>
                            <input type="password" className="form-control" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{ maxWidth: '100%' }}>
                            <label>System Authority Role</label>
                            <select className="form-control" style={{ maxWidth: '100%' }} value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                                <option value="Normal User">Normal User</option>
                                <option value="Store Owner">Store Owner</option>
                                <option value="System Administrator">System Administrator</option>
                            </select>
                        </div>
                        <button type="submit" className="btn" style={{ maxWidth: '100%', margin: '15px 0 0 0' }}>Save User Record</button>
                    </form>
                </div>

                <div style={{ flex: 1, minWidth: '280px' }}>
                    <h3 style={{ color: '#1e293b', border: 'none', padding: 0, marginBottom: '15px' }}>Provision New Store Entity</h3>
                    <form onSubmit={handleCreateStore}>
                        <div className="form-group" style={{ maxWidth: '100%' }}>
                            <label>Commercial Store Name</label>
                            <input type="text" className="form-control" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{ maxWidth: '100%' }}>
                            <label>Contact Business Email</label>
                            <input type="email" className="form-control" value={storeForm.email} onChange={e => setStoreForm({...storeForm, email: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{ maxWidth: '100%' }}>
                            <label>Store Address</label>
                            <input type="text" className="form-control" value={storeForm.address} onChange={e => setStoreForm({...storeForm, address: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{ maxWidth: '100%' }}>
                            <label>Assigned Owner User ID (Optional)</label>
                            <input type="text" className="form-control" value={storeForm.ownerId} placeholder="Leave blank if unassigned" onChange={e => setStoreForm({...storeForm, ownerId: e.target.value})} />
                        </div>
                        <button type="submit" className="btn" style={{ maxWidth: '100%', margin: '15px 0 0 0' }}>Save Store Entity</button>
                    </form>
                </div>
            </div>

            <h3>Registered Store Directory</h3>
            <input type="text" className="search-bar" placeholder="🔍 Filter stores by Name, Email, or Address..." onChange={e => setStoreSearch(e.target.value)} />
            {storesLoading ? <div className="loading-indicator">Synchronizing store elemetry records...</div> : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th onClick={() => toggleSort('store', 'name')}>Store Identity Name ↕</th>
                            <th onClick={() => toggleSort('store', 'email')}>Email Address ↕</th>
                            <th onClick={() => toggleSort('store', 'address')}>Store Address ↕</th>
                            <th onClick={() => toggleSort('store', 'avg_rating')}>Average Rating ↕</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map(s => (
                            <tr key={s.id}>
                                <td><strong>{s.name}</strong></td>
                                <td>{s.email}</td>
                                <td>{s.address}</td>
                                <td><span style={{ fontWeight: '600', color: '#b7791f' }}>★ {parseFloat(s.avg_rating).toFixed(1)}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <h3 style={{ marginTop: '40px' }}>System Platform Profile Directory</h3>
            <input type="text" className="search-bar" placeholder="🔍 Filter users by Name, Email, Address, or Role..." onChange={e => setUserSearch(e.target.value)} />
            {usersLoading ? <div className="loading-indicator">Loading system profile indices...</div> : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th onClick={() => toggleSort('user', 'name')}>Legal Profile Name ↕</th>
                            <th onClick={() => toggleSort('user', 'email')}>Email Account ↕</th>
                            <th onClick={() => toggleSort('user', 'address')}>Address ↕</th>
                            <th onClick={() => toggleSort('user', 'role')}>Authority Role ↕</th>
                            <th>Store Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td><strong>{u.name}</strong></td>
                                <td>{u.email}</td>
                                <td>{u.address}</td>
                                <td><span className={`badge ${u.role === 'System Administrator' ? 'admin' : u.role === 'Store Owner' ? 'owner' : 'user'}`}>{u.role}</span></td>
                                <td>
                                    {u.role === 'Store Owner' ? (
                                        <span style={{ color: '#2f855a', fontWeight: 'bold' }}>★ {parseFloat(u.user_store_rating).toFixed(1)}</span>
                                    ) : <span style={{ color: '#a0aec0' }}>—</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;