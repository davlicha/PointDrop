import { useState, useEffect } from 'react';
import { searchUsers } from '../services/userService';
import { useDebounce } from '../hooks/useDebounce';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function UserSearch({ merchantId, onSelectUser }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!debouncedQuery || !debouncedQuery.trim() || !merchantId) {
      setUsers([]);
      return;
    }

    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const results = await searchUsers(debouncedQuery, merchantId);
        setUsers(results);
        if (results.length === 0) {
          setError('Користувача не знайдено в системі цього закладу');
        }
      } catch (err) {
        console.error('Error searching users:', err);
        setError('Помилка пошуку користувачів');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [debouncedQuery, merchantId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', position: 'relative' }}>
      <PhoneInput
        className="input-base"
        placeholder="Пошук за номером телефону"
        value={query}
        onChange={(value) => setQuery(value || '')}
        defaultCountry="UA"
        international
        countryCallingCodeEditable={false}
        style={{ marginBottom: 0 }}
      />
      
      {loading && <div className="notice-success">Пошук...</div>}
      
      {error && !loading && <div className="notice-error">{error}</div>}

      {users.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--card-bg-solid)',
          borderRadius: '12px',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--shadow-lg)',
          marginTop: '4px',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          padding: '8px'
        }}>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="menu-item"
              style={{ cursor: 'pointer', padding: '10px 12px' }}
            >
              <div>
                <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>{user.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '2px' }}>{user.phone}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
