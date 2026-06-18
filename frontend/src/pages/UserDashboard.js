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

    const handleActionRate = async (storeId, isModification) => {
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
                alert(isModification ? 'rating modify successfully' : 'Rating submitted successfully');
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
                            <th>Store Address</th>
                            <th>Global Average</th>
                            <th>Total Reviews</th>
                            <th style={{ textAlign: 'center' }}>Your Current Rating</th>
                            <th style={{ textAlign: 'center' }}>Select Rating Score</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((s, index) => (
                            <tr key={s.id}>
                                <td>{index + 1}</td>
                                <td><strong>{s.name}</strong></td>
                                <td>{s.address}</td>
                                <td>
                                    <span style={{ fontWeight: '600', color: '#b7791f' }}>
                                        ★ {parseFloat(s.avg_rating).toFixed(1)}
                                    </span>
                                </td>
                                <td><span className="badge user">{s.total_reviews} reviews</span></td>
                                <td style={{ textAlign: 'center' }}>
                                    {s.personal_rating ? (
                                        <span style={{ backgroundColor: '#e2e8f0', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', color: '#1e293b' }}>
                                            ★ {s.personal_rating}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>Not Rated Yet</span>
                                    )}
                                </td>
                                <td style={{ textAlign: 'center', minWidth: '180px' }}>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map(num => (
            <div
                key={num}
                onClick={() => handleSelectStar(s.id, num)}
                style={{
                    position: 'relative',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'transform 0.1s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.15)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
                {/* Background Star Character */}
                <span style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    fontSize: '32px',
                    lineHeight: '32px',
                    textAlign: 'center',
                    color: selectedRatings[s.id] >= num ? '#ca8a04' : '#cbd5e1',
                    zIndex: 1
                }}>
                    ★
                </span>
                
                {/* Foreground Star Numeric Label */}
                <span style={{
                    position: 'relative',
                    zIndex: 2,
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: selectedRatings[s.id] >= num ? '#ffffff' : '#475569',
                    marginTop: '2px' 
                }}>
                    {num}
                </span>
            </div>
        ))}
    </div>
</td>
                                <td style={{ textAlign: 'center' }}>
                                    {s.personal_rating ? (
                                        <button 
                                            onClick={() => handleActionRate(s.id, true)}
                                            style={{ margin: 0, padding: '6px 12px', fontSize: '13px', width: 'auto', backgroundColor: '#475569', color: '#ffffff' }}
                                        >
                                            Modify Rating
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleActionRate(s.id, false)}
                                            style={{ margin: 0, padding: '6px 12px', fontSize: '13px', width: 'auto', backgroundColor: '#3a7e7d', color: '#ffffff' }}
                                        >
                                            Submit Rating
                                        </button>
                                    )}
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