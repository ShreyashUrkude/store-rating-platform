import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px' }}>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        
                        {/* Secured Administration Territory */}
                        <Route 
                            path="/admin" 
                            element={
                                <ProtectedRoute allowedRoles={['System Administrator']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Secured Consumer Territory */}
                        <Route 
                            path="/user" 
                            element={
                                <ProtectedRoute allowedRoles={['Normal User']}>
                                    <UserDashboard />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Secured Business Owner Territory */}
                        <Route 
                            path="/owner" 
                            element={
                                <ProtectedRoute allowedRoles={['Store Owner']}>
                                    <StoreOwnerDashboard />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Fallback Catch-All Safety Net */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;