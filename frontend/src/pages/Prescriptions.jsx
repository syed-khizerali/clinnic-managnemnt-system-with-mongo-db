import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { prescriptions } from '../lib/api';

export default function Prescriptions() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prescriptions.getAll().then(({ data }) => {
      setList(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDownload = async (id) => {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
        {['admin', 'doctor'].includes(user?.role) && (
          <Link to="/prescriptions/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Prescription
          </Link>
        )}
      </div>
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No prescriptions found</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {list.map((p) => (
              <div
                key={p._id}
                className="p-6 hover:bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{p.patientId?.name}</p>
                    <p className="text-sm text-gray-600">{p.diagnosis || 'No diagnosis'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(p.createdAt).toLocaleDateString()} • Dr. {p.doctorId?.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link
                    to={`/prescriptions/${p._id}`}
                    className="text-primary-600 hover:underline font-medium"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDownload(p._id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
