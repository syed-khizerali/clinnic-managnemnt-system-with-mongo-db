import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patients } from '../lib/api';

export default function PatientForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'male',
    contact: '',
    email: '',
    address: '',
    bloodGroup: '',
    allergies: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        age: parseInt(form.age, 10),
        allergies: form.allergies ? form.allergies.split(',').map((a) => a.trim()) : [],
      };
      await patients.create(payload);
      navigate('/patients');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Register Patient</h1>
      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
        )}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="input-field"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="input-field"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact *</label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            <input
              type="text"
              value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
              className="input-field"
              placeholder="e.g. A+"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
            <input
              type="text"
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              className="input-field"
              placeholder="Comma separated"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Register Patient'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
