import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserDashboard = () => {
    const { token } = useContext(AuthContext);
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedRatings, setSelectedRatings] = useState({});

    const loadStores = () => {
        fetch(`http://localhost:5000/api/user/stores?search=${search}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => { 
                setStores(data); 
                setLoading(false);
                const initialRatings = {};
                data.forEach(s => {
                    initialRatings[s.id] = s.personal_rating || null;
                });
                setSelectedRatings(initialRatings);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        loadStores();
    }, [search, token]);

    const handleSelectStar = (storeId, value) => {
        setSelectedRatings(prev => ({ ...prev, [storeId]: value }));
    };

    const handleSubmitRate = async (storeId) => {
        const ratingValue = selectedRatings[storeId];
        if (!ratingValue) {
            alert('Please select a star rating value first');
            return;
        }
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
                alert('rating modify successfully');
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
                            <th>SNo</th>
                            <th>Store Identity Name</th>
                            <th>Contact Email</th>
                            <th>Physical Address</th>
                            <th>Global Rating</th>
                            <th>Total Reviews</th>
                            <th style={{ textAlign: 'center' }}>Select Rating Score</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((s, index) => (
                            <tr key={s.id}>
                                <td>{index + 1}</td>
                                <td><strong>{s.name}</strong></td>
                                <td>{s.email}</td>
                                <td>{s.address}</td>
                                <td>
                                    <span style={{ fontWeight: '600', color: '#b7791f' }}>
                                        ★ {parseFloat(s.avg_rating).toFixed(1)}
                                    </span>
                                </td>
                                <td><span className="badge user">{s.total_reviews} reviews</span></td>
                                <td style={{ textAlign: 'center', minWidth: '200px' }}>
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button
                                            key={num}
                                            className={`rating-btn ${selectedRatings[s.id] === num ? 'active' : ''}`}
                                            onClick={() => handleSelectStar(s.id, num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleSubmitRate(s.id)}
                                        style={{ margin: 0, padding: '6px 12px', fontSize: '13px', width: 'auto', backgroundColor: '#3a7e7d' }}
                                    >
                                        {s.personal_rating ? 'Modify Rating' : 'Submit Rating'}
                                    </button>
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