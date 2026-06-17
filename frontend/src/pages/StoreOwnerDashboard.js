import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const StoreOwnerDashboard = () => {
    const { token } = useContext(AuthContext);
    const [metrics, setMetrics] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/owner/my-store-stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (res.status === 444) throw new Error('No storefront profile currently linked to this owner identity asset');
                if (!res.ok) throw new Error('Failed to synchronize business analytics indices');
                return res.json();
            })
            .then(data => { setMetrics(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [token]);

    if (loading) return <div className="loading-indicator">Synchronizing enterprise telemetry streams...</div>;
    if (error) return <div className="dashboard-container"><div className="alert-error">{error}</div></div>;

    return (
        <div className="dashboard-container">
            <h2>Store Performance Console</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>
                Real-time operational feedback index for <strong>{metrics.storeName}</strong> ({metrics.storeEmail})
            </p>

            <div className="stats-grid">
                <div className="stats-card" style={{ borderTop: '4px solid #ca8a04' }}>
                    <h4>Aggregate Score</h4>
                    <p style={{ color: '#ca8a04' }}>★ {metrics.avgRating}</p>
                </div>
                <div className="stats-card" style={{ borderTop: '4px solid #4ea3a1' }}>
                    <h4>Total Responses</h4>
                    <p style={{ color: '#3a7e7d' }}>{metrics.totalRatings}</p>
                </div>
                <div className="stats-card" style={{ borderTop: '4px solid #1e293b' }}>
                    <h4>Physical Outlet Location</h4>
                    <p style={{ fontSize: '16px', fontWeight: 'normal', color: '#475569', marginTop: '10px' }}>
                        {metrics.storeAddress}
                    </p>
                </div>
            </div>

            <h3>Rating Distribution Allocation Index</h3>
            <table className="data-table" style={{ maxWidth: '500px', margin: '15px 0' }}>
                <thead>
                    <tr>
                        <th>Consumer Evaluation Star</th>
                        <th>Registered Response Count</th>
                    </tr>
                </thead>
                <tbody>
                    {metrics.breakdown.length === 0 ? (
                        <tr><td colSpan="2" style={{ fontStyle: 'italic', color: '#64748b' }}>No rating records logged yet</td></tr>
                    ) : (
                        metrics.breakdown.map(b => (
                            <tr key={b.rating}>
                                <td><strong>{b.rating} Star Rating</strong></td>
                                <td><span className="badge user">{b.count} submissions</span></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StoreOwnerDashboard;