import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, FileText, ArrowLeft } from 'lucide-react';
import { patients } from '../lib/api';

export default function PatientDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patients.getById(id).then(({ data }) => {
      setData(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  const { patient, appointments, prescriptions, timeline } = data;

  return (
    <div>
      <Link
        to="/patients"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Patients
      </Link>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Patient Info</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="font-medium">{patient.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Age / Gender</dt>
                <dd className="font-medium">{patient.age} / {patient.gender}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Contact</dt>
                <dd className="font-medium">{patient.contact}</dd>
              </div>
              {patient.email && (
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd className="font-medium">{patient.email}</dd>
                </div>
              )}
              {patient.allergies?.length > 0 && (
                <div>
                  <dt className="text-sm text-gray-500">Allergies</dt>
                  <dd className="font-medium">{patient.allergies.join(', ')}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Medical History Timeline</h2>
            <div className="space-y-4">
              {(timeline || []).slice(0, 10).map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    {item.type === 'appointment' ? (
                      <Calendar className="w-5 h-5 text-primary-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 capitalize">{item.type}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                    {item.type === 'prescription' && item.data?.diagnosis && (
                      <p className="text-sm text-gray-700 mt-1">{item.data.diagnosis}</p>
                    )}
                  </div>
                  {item.type === 'prescription' && (
                    <Link
                      to={`/prescriptions/${item.data._id}`}
                      className="text-primary-600 hover:underline text-sm font-medium"
                    >
                      View
                    </Link>
                  )}
                </div>
              ))}
              {(!timeline || timeline.length === 0) && (
                <p className="text-gray-500 text-center py-8">No history yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
