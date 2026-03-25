import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addClaim, clearClaims, fetchClaims, deleteClaim } from './store';
import './ClaimsComponent.css';

export function ClaimsComponent() {
  const dispatch = useDispatch();
  const { data: claims = [], loading, error } = useSelector((state) => state.claims);

  useEffect(() => {
    // Fetch claims from database on component mount
    dispatch(fetchClaims());
  }, [dispatch]);

  const [claimForm, setClaimForm] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'general',
  });

  const categories = [
    'general',
    'medical',
    'dental',
    'vision',
    'auto',
    'home',
    'life',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClaimForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (claimForm.description && claimForm.amount) {
      dispatch(addClaim({
        description: claimForm.description,
        amount: claimForm.amount,
      }));
      setClaimForm({
        title: '',
        description: '',
        amount: '',
        category: 'general',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="claims-container">
      <h1>📋 Claims Management</h1>

      <div className="claims-layout">
        {/* Claim Form */}
        <div className="claim-form-section">
          <h2>Submit New Claim</h2>
          <form onSubmit={handleSubmit} className="claim-form">
            <div className="form-group">
              <label htmlFor="title">Claim Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={claimForm.title}
                onChange={handleInputChange}
                placeholder="Brief description of your claim"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={claimForm.category}
                onChange={handleInputChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Claim Amount ($)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={claimForm.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={claimForm.description}
                onChange={handleInputChange}
                placeholder="Detailed description of your claim..."
                rows="4"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </form>
        </div>

        {/* Claims List */}
        <div className="claims-list-section">
          <div className="claims-header">
            <h2>Your Claims</h2>
            <button onClick={() => dispatch(clearClaims())} className="clear-btn">
              Clear All
            </button>
          </div>

          {error && <p className="error">Error: {error}</p>}

          <div className="claims-list">
            {claims.length === 0 ? (
              <p className="no-claims">No claims submitted yet</p>
            ) : (
              claims.map((claim) => (
                <div key={claim.id} className="claim-card">
                  <div className="claim-header">
                    <h3>{claim.title}</h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(claim.status) }}
                    >
                      {claim.status}
                    </span>
                  </div>

                  <div className="claim-details">
                    <p><strong>Category:</strong> {claim.category}</p>
                    <p><strong>Amount:</strong> ${parseFloat(claim.amount).toFixed(2)}</p>
                    <p><strong>Submitted:</strong> {new Date(claim.submittedAt).toLocaleDateString()}</p>
                  </div>

                  <p className="claim-description">{claim.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClaimsComponent;
