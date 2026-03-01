import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { appointments } from '../lib/api';

export default function AppointmentDetail() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointments.getById(id).then(({ data }) => {
      setAppointment(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading || !appointment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-600',
  };

  return (
    <div>
      <Link
        to="/appointments"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Appointments
      </Link>
      <div className="card max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Appointment</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[appointment.status] || 'bg-gray-100'
            }`}
          >
            {appointment.status}
          </span>
        </div>
        <dl className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <dt className="text-sm text-gray-500">Date & Time</dt>
              <dd className="font-medium">{new Date(appointment.date).toLocaleString()}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <dt className="text-sm text-gray-500">Patient</dt>
              <dd className="font-medium">{appointment.patientId?.name}</dd>
              <dd className="text-sm text-gray-600">{appointment.patientId?.contact}</dd>
            </div>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Doctor</dt>
            <dd className="font-medium">Dr. {appointment.doctorId?.name}</dd>
            {appointment.doctorId?.specialization && (
              <dd className="text-sm text-gray-600">{appointment.doctorId.specialization}</dd>
            )}
          </div>
          {appointment.reason && (
            <div>
              <dt className="text-sm text-gray-500">Reason</dt>
              <dd className="font-medium">{appointment.reason}</dd>
            </div>
          )}
          {appointment.notes && (
            <div>
              <dt className="text-sm text-gray-500">Notes</dt>
              <dd className="font-medium">{appointment.notes}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
