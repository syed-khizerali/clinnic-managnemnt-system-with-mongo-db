import { useEffect, useState } from 'react';
import { Users as UsersIcon, Shield, Stethoscope } from 'lucide-react';
import { users as usersApi } from '../lib/api';

export default function Users() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    usersApi.getAll({ role: filter || undefined }).then(({ data }) => {
      setList(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filter]);

  const roleIcons = {
    admin: Shield,
    doctor: Stethoscope,
    receptionist: UsersIcon,
    patient: UsersIcon,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="receptionist">Receptionist</option>
          <option value="patient">Patient</option>
        </select>
      </div>
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Plan</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((u) => {
                  const Icon = roleIcons[u.role] || UsersIcon;
                  return (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary-600" />
                          </div>
                          <span className="font-medium text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="capitalize px-2 py-1 rounded bg-gray-100 text-gray-700 text-sm">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 capitalize">{u.subscriptionPlan}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
