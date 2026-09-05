import React from 'react'
import { useState } from 'react';

function AdminUsers() {
    const [form, setForm] = useState({ username: '', password: '' });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Both username and password are required.'); setSuccess(''); return;
    }
    if (users.some((u) => u.username === form.username.trim())) {
      setError('That username already exists.'); setSuccess(''); return;
    }
    setUsers([{ username: form.username.trim(), createdAt: new Date() }, ...users]);
    setForm({ username: '', password: '' });
    setError('');
    setSuccess(`User "${form.username.trim()}" was created.`);
  };
  return (
    <div className="row-2" style={{ alignItems: 'start' }}>
      <div className="card card-pad">
        <div className="eyebrow">Administration</div>
        <h2>Create a user</h2>
        <p>New team members get access with a username and password. This screen is static and stores users for this session only.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="e.g. priya.sharma" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" />
          </div>
          <button type="submit" className="btn btn-primary">Create user</button>
        </form>
      </div>

      <div className="card card-pad">
        <div className="eyebrow">This session</div>
        <h2>Created users</h2>
        {users.length === 0 ? (
          <p>No users created yet — they'll appear here once added.</p>
        ) : (
          <table className="dms-table">
            <thead><tr><th>Username</th><th>Created</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.username}><td>{u.username}</td><td>{u.createdAt.toLocaleTimeString()}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
