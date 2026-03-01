import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { patients } from '../lib/api';

export default function Patients() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    patients.getAll({ search: search || undefined }).then(({ data }) => {
      setList(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <div className="flex gap-4">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          {['admin', 'receptionist'].includes(user?.role) && (
            <Link to="/patients/new" className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Patient
            </Link>
          )}
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No patients found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Age</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Gender</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.age}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{p.gender}</td>
                    <td className="px-6 py-4 text-gray-600">{p.contact}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/patients/${p._id}`}
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
