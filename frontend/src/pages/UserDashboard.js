import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserDashboard = () => {
    const { token } = useContext(AuthContext);
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const loadStores = () => {
        fetch(`http://localhost:5000/api/user/stores?search=${search}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => { setStores(data); setLoading(false); })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        loadStores();
    }, [search, token]);

    const handleRate = async (storeId, ratingValue) => {
        try {
            const res = await fetch('http://localhost:5000/api/user/rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ storeId, ratingValue })
            });
            if (res.ok) {
                loadStores();
            } else {
                const data = await res.json();
                alert(data.message || 'Submission rejected');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Consumer Feedback Dashboard</h2>
            <h3>Commercial Store Directory</h3>
            <input 
                type="text" 
                className="search-bar" 
                placeholder="🔍 Search stores by business name or location address..." 
                value={search}
                onChange={e => setSearch(e.target.value)} 
            />

            {loading ? (
                <div className="loading-indicator">Fetching verified platform directory indices...</div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Store Identity Name</th>
                            <th>Contact Email</th>
                            <th>Physical Address</th>
                            <th>Global Rating</th>
                            <th>Total Reviews</th>
                            <th style={{ textAlign: 'center' }}>Your Evaluation Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map(s => (
                            <tr key={s.id}>
                                <td><strong>{s.name}</strong></td>
                                <td>{s.email}</td>
                                <td>{s.address}</td>
                                <td>
                                    <span style={{ fontWeight: '600', color: '#b7791f' }}>
                                        ★ {parseFloat(s.avg_rating).toFixed(1)}
                                    </span>
                                </td>
                                <td><span className="badge user">{s.total_reviews} reviews</span></td>
                                <td style={{ textAlign: 'center', minWidth: '220px' }}>
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button
                                            key={num}
                                            className={`rating-btn ${s.personal_rating === num ? 'active' : ''}`}
                                            onClick={() => handleRate(s.id, num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserDashboard;