import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analytics } from '../lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (user?.role === 'admin') {
          const { data } = await analytics.admin();
          setStats(data);
        } else if (user?.role === 'doctor') {
          const { data } = await analytics.doctor();
          setStats(data);
        }
      } catch {
        setStats({});
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (user?.role === 'admin') {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Patients"
            value={stats?.totalPatients ?? 0}
            color="primary"
          />
          <StatCard
            icon={Activity}
            label="Total Doctors"
            value={stats?.totalDoctors ?? 0}
            color="emerald"
          />
          <StatCard
            icon={Calendar}
            label="Monthly Appointments"
            value={stats?.monthlyAppointments ?? 0}
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="Revenue (Simulated)"
            value={`$${(stats?.revenue ?? 0).toLocaleString()}`}
            color="purple"
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">AI Usage This Month</h3>
            <p className="text-3xl font-bold text-primary-600">
              {stats?.aiUsageCount ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">API calls</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Most Common Diagnosis</h3>
            <ul className="space-y-2">
              {(stats?.mostCommonDiagnosis || []).slice(0, 5).map((d) => (
                <li key={d._id} className="flex justify-between">
                  <span className="text-gray-700">{d._id || 'N/A'}</span>
                  <span className="font-medium">{d.count}</span>
                </li>
              ))}
              {(!stats?.mostCommonDiagnosis || stats.mostCommonDiagnosis.length === 0) && (
                <li className="text-gray-500">No data yet</li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <Link to="/users" className="btn-primary flex items-center gap-2">
            Manage Users
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/analytics" className="btn-secondary flex items-center gap-2">
            View Analytics
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role === 'doctor') {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            label="Today's Appointments"
            value={stats?.dailyAppointments ?? 0}
            color="primary"
          />
          <StatCard
            icon={Activity}
            label="Monthly Appointments"
            value={stats?.monthlyAppointments ?? 0}
            color="emerald"
          />
          <StatCard
            icon={FileText}
            label="Prescriptions This Month"
            value={stats?.monthlyPrescriptions ?? 0}
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="AI Usage"
            value={stats?.aiUsageCount ?? 0}
            color="purple"
          />
        </div>
        <div className="flex gap-4">
          <Link to="/appointments" className="btn-primary flex items-center gap-2">
            View Appointments
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/prescriptions" className="btn-secondary flex items-center gap-2">
            Prescriptions
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role === 'receptionist') {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Receptionist Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/patients"
            className="card hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
              <Users className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Register Patient</h3>
              <p className="text-sm text-gray-600">Add new patients to the system</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
          </Link>
          <Link
            to="/appointments"
            className="card hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-medical-emeraldLight flex items-center justify-center">
              <Calendar className="w-7 h-7 text-medical-emerald" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Schedule</h3>
              <p className="text-sm text-gray-600">Book and manage appointments</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
          </Link>
        </div>
      </div>
    );
  }

  // Patient
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Patient Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/appointments"
          className="card hover:shadow-lg transition-shadow flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
            <Calendar className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">My Appointments</h3>
            <p className="text-sm text-gray-600">View appointment history</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
        </Link>
        <Link
          to="/prescriptions"
          className="card hover:shadow-lg transition-shadow flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-xl bg-medical-emeraldLight flex items-center justify-center">
            <FileText className="w-7 h-7 text-medical-emerald" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">My Prescriptions</h3>
            <p className="text-sm text-gray-600">View and download prescriptions</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    emerald: 'bg-medical-emeraldLight text-medical-emerald',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };
  return (
    <div className="card">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
