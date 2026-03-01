import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, Brain } from 'lucide-react';
import { prescriptions, ai } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function PrescriptionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [explaining, setExplaining] = useState(false);

  useEffect(() => {
    prescriptions.getById(id).then(({ data }) => {
      setPrescription(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    try {
      const { data } = await prescriptions.downloadPDF(id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Download failed');
    }
  };

  const handleExplain = async () => {
    setExplaining(true);
    try {
      const { data } = await ai.explainPrescription(id);
      setPrescription((p) => ({ ...p, aiExplanation: data.explanation }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate explanation');
    } finally {
      setExplaining(false);
    }
  };

  if (loading || !prescription) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  const canUseAI = ['pro', 'enterprise'].includes(user?.subscriptionPlan) || user?.role === 'admin';

  return (
    <div>
      <Link
        to="/prescriptions"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Prescriptions
      </Link>
      <div className="card max-w-3xl">
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Prescription</h1>
          <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-gray-500">Patient</dt>
            <dd className="font-medium">{prescription.patientId?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Doctor</dt>
            <dd className="font-medium">Dr. {prescription.doctorId?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Date</dt>
            <dd className="font-medium">{new Date(prescription.createdAt).toLocaleDateString()}</dd>
          </div>
          {prescription.diagnosis && (
            <div>
              <dt className="text-sm text-gray-500">Diagnosis</dt>
              <dd className="font-medium">{prescription.diagnosis}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm text-gray-500 mb-2">Medications</dt>
            <dd>
              <ul className="space-y-2">
                {prescription.medicines?.map((m, i) => (
                  <li key={i} className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{m.name}</span> - {m.dosage}
                    {m.frequency && ` (${m.frequency})`}
                    {m.duration && ` for ${m.duration}`}
                    {m.notes && <p className="text-sm text-gray-600 mt-1">{m.notes}</p>}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          {prescription.instructions && (
            <div>
              <dt className="text-sm text-gray-500">Instructions</dt>
              <dd className="font-medium">{prescription.instructions}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm text-gray-500 mb-2">AI Explanation</dt>
            <dd>
              {prescription.aiExplanation ? (
                <div className="p-4 bg-primary-50 rounded-lg">
                  <p className="text-gray-700">{prescription.aiExplanation}</p>
                </div>
              ) : canUseAI && ['doctor', 'admin'].includes(user?.role) ? (
                <button
                  onClick={handleExplain}
                  disabled={explaining}
                  className="flex items-center gap-2 text-primary-600 hover:underline font-medium"
                >
                  <Brain className="w-5 h-5" />
                  {explaining ? 'Generating...' : 'Generate AI Explanation'}
                </button>
              ) : (
                <p className="text-gray-500">No AI explanation available</p>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
