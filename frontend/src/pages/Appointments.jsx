import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { appointments, users } from '../lib/api';

export default function Appointments() {
  const [list, setList] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    Promise.all([
      appointments.getAll({ status: status || undefined, date: date || undefined }),
      users.getDoctors().catch(() => ({ data: [] })),
    ]).then(([appRes, docRes]) => {
      setList(appRes.data);
      setDoctors(docRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [status, date]);

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-600',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <div className="flex flex-wrap gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field w-auto"
          />
          <Link to="/appointments/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Book Appointment
          </Link>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No appointments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Patient</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Doctor</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        {new Date(a.date).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{a.patientId?.name}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{a.doctorId?.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[a.status] || 'bg-gray-100'}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/appointments/${a._id}`}
                        className="text-primary-600 hover:underline font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
