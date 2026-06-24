import React from 'react';
import { useNavigate } from 'react-router-dom';

function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="page-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div className="status-icon-lg status-error" style={{ marginBottom: '24px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="9" y1="12" x2="15" y2="12"></line></svg>
        </div>
        <h2 className="status-title" style={{ color: 'var(--primary)', marginBottom: '16px' }}>403 - Доступ заборонено</h2>
        <p className="status-sub" style={{ marginBottom: '32px' }}>
          У вас немає прав для перегляду цієї сторінки.
        </p>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/')}
          style={{ padding: '12px 32px' }}
        >
          На головну
        </button>
      </div>
    </div>
  );
}

export default ForbiddenPage;
