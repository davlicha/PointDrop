import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="page-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div className="status-icon-lg status-error" style={{ marginBottom: '24px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h2 className="status-title" style={{ color: 'var(--primary)', marginBottom: '16px' }}>404 - Сторінку не знайдено</h2>
        <p className="status-sub" style={{ marginBottom: '32px' }}>
          Схоже, ви перейшли за неіснуючим посиланням або сторінка була видалена.
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

export default NotFoundPage;
