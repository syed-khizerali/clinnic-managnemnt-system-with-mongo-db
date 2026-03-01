import { useEffect, useState } from 'react';
import { analytics } from '../lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#2563eb', '#059669', '#7c3aed', '#ea580c'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analytics.admin()
      .then(({ data }) => setData(data))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  const diagnosisData = (data?.mostCommonDiagnosis || []).map((d, i) => ({
    name: d._id || 'Other',
    value: d.count,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600">Total Patients</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data?.totalPatients ?? 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Total Doctors</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data?.totalDoctors ?? 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Monthly Appointments</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data?.monthlyAppointments ?? 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Revenue (Simulated)</p>
          <p className="text-3xl font-bold text-primary-600 mt-1">
            ${(data?.revenue ?? 0).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Most Common Diagnosis</h3>
          {diagnosisData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diagnosisData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {diagnosisData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No diagnosis data yet</p>
          )}
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">AI Usage This Month</h3>
          <p className="text-5xl font-bold text-primary-600">{data?.aiUsageCount ?? 0}</p>
          <p className="text-gray-500 mt-2">API calls</p>
        </div>
      </div>
    </div>
  );
}
