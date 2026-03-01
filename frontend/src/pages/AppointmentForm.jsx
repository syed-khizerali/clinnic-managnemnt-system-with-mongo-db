import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointments, users, patients } from '../lib/api';

export default function AppointmentForm() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    timeSlot: '',
    reason: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      users.getDoctors(),
      patients.getAll(),
    ]).then(([dRes, pRes]) => {
      setDoctors(dRes.data);
      setPatientList(pRes.data);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        date: new Date(form.date + (form.timeSlot ? 'T' + form.timeSlot : 'T09:00:00')),
      };
      await appointments.create(payload);
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Appointment</h1>
      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
        )}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
            <select
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select patient</option>
              {patientList.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} - {p.contact}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Doctor *</label>
            <select
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} {d.specialization ? `(${d.specialization})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input
              type="time"
              value={form.timeSlot}
              onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-field"
              rows={3}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/appointments')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
