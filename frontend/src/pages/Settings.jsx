import { useEffect, useState } from 'react';
import { clinic } from '../lib/api';

export default function Settings() {
  const [settings, setSettings] = useState({ aiEnabled: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clinic.getSettings()
      .then(({ data }) => setSettings(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Clinic Settings</h1>
      <div className="card max-w-2xl">
        <h2 className="font-semibold text-gray-900 mb-4">AI Features</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">AI Explanation for Patients</p>
            <p className="text-sm text-gray-600">
              When enabled, patients can see AI-generated explanations of their prescriptions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                settings.aiEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {settings.aiEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Note: AI settings are managed at the clinic level. Contact your admin to change these.
        </p>
      </div>
    </div>
  );
}
