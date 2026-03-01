import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { prescriptions, patients, ai } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Brain, Plus, Trash2 } from 'lucide-react';

export default function PrescriptionForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patientList, setPatientList] = useState([]);
  const [form, setForm] = useState({
    patientId: '',
    diagnosis: '',
    instructions: '',
    notes: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
  });
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState({ symptoms: '', age: '', gender: 'male', history: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    patients.getAll().then(({ data }) => setPatientList(data)).catch(() => {});
  }, []);

  const addMedicine = () => {
    setForm((f) => ({
      ...f,
      medicines: [...f.medicines, { name: '', dosage: '', frequency: '', duration: '', notes: '' }],
    }));
  };

  const removeMedicine = (i) => {
    setForm((f) => ({
      ...f,
      medicines: f.medicines.filter((_, idx) => idx !== i),
    }));
  };

  const updateMedicine = (i, field, value) => {
    setForm((f) => ({
      ...f,
      medicines: f.medicines.map((m, idx) =>
        idx === i ? { ...m, [field]: value } : m
      ),
    }));
  };

  const handleAiAssist = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const { data } = await ai.assist(aiInput);
      setAiResult(data.data);
    } catch (err) {
      setAiResult({
        possibleConditions: ['AI unavailable'],
        suggestedTests: [],
        treatmentRecommendations: [],
        riskLevel: 'medium',
        fallbackUsed: true,
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        medicines: form.medicines.filter((m) => m.name && m.dosage),
      };
      await prescriptions.create(payload);
      navigate('/prescriptions');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const canUseAI = ['pro', 'enterprise'].includes(user?.subscriptionPlan) || user?.role === 'admin';

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Prescription</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
              <select
                value={form.patientId}
                onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select patient</option>
                {patientList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} - {p.age}y
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
              <input
                type="text"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medications</label>
              <div className="space-y-4">
                {form.medicines.map((m, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Medicine name"
                        value={m.name}
                        onChange={(e) => updateMedicine(i, 'name', e.target.value)}
                        className="input-field"
                      />
                      <input
                        placeholder="Dosage"
                        value={m.dosage}
                        onChange={(e) => updateMedicine(i, 'dosage', e.target.value)}
                        className="input-field"
                      />
                      <input
                        placeholder="Frequency (e.g. twice daily)"
                        value={m.frequency}
                        onChange={(e) => updateMedicine(i, 'frequency', e.target.value)}
                        className="input-field"
                      />
                      <input
                        placeholder="Duration (e.g. 7 days)"
                        value={m.duration}
                        onChange={(e) => updateMedicine(i, 'duration', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="flex justify-between">
                      <input
                        placeholder="Notes"
                        value={m.notes}
                        onChange={(e) => updateMedicine(i, 'notes', e.target.value)}
                        className="input-field flex-1 mr-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedicine(i)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMedicine}
                  className="flex items-center gap-2 text-primary-600 hover:underline font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Medicine
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              <textarea
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Save Prescription'}
              </button>
              <button type="button" onClick={() => navigate('/prescriptions')} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
        {canUseAI && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-600" />
              AI Diagnosis Assist
            </h3>
            <div className="space-y-4">
              <input
                placeholder="Symptoms"
                value={aiInput.symptoms}
                onChange={(e) => setAiInput({ ...aiInput, symptoms: e.target.value })}
                className="input-field"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Age"
                  value={aiInput.age}
                  onChange={(e) => setAiInput({ ...aiInput, age: e.target.value })}
                  className="input-field"
                />
                <select
                  value={aiInput.gender}
                  onChange={(e) => setAiInput({ ...aiInput, gender: e.target.value })}
                  className="input-field"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <input
                placeholder="Medical history"
                value={aiInput.history}
                onChange={(e) => setAiInput({ ...aiInput, history: e.target.value })}
                className="input-field"
              />
              <button
                type="button"
                onClick={handleAiAssist}
                disabled={aiLoading}
                className="btn-primary w-full"
              >
                {aiLoading ? 'Analyzing...' : 'Get AI Suggestions'}
              </button>
              {aiResult && (
                <div className="p-4 bg-primary-50 rounded-lg space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Possible Conditions</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {aiResult.possibleConditions?.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  {aiResult.suggestedTests?.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700">Suggested Tests</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {aiResult.suggestedTests.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {aiResult.treatmentRecommendations?.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700">Treatment Recommendations</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {aiResult.treatmentRecommendations.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Risk level: {aiResult.riskLevel}
                    {aiResult.fallbackUsed && ' (Fallback - AI unavailable)'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
