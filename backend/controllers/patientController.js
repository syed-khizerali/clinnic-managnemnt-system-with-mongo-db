import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';

export const getPatients = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (req.user.role === 'patient') {
      filter.$or = [{ _id: req.user.patientId }, { userId: req.user.id }];
    } else if (req.user.role === 'doctor') {
      const doctorAppointments = await Appointment.find({ doctorId: req.user.id }).distinct('patientId');
      filter._id = { $in: doctorAppointments };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const patients = await Patient.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch patients.' });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('createdBy', 'name');
    if (!patient) return res.status(404).json({ message: 'Patient not found.' });

    if (req.user.role === 'patient') {
      const isOwn = patient._id.toString() === req.user.patientId?.toString() || patient.userId?.toString() === req.user.id;
      if (!isOwn) return res.status(403).json({ message: 'Access denied.' });
    }

    const [appointments, prescriptions] = await Promise.all([
      Appointment.find({ patientId: patient._id }).populate('doctorId', 'name specialization').sort({ date: -1 }),
      Prescription.find({ patientId: patient._id }).populate('doctorId', 'name').sort({ createdAt: -1 }),
    ]);

    const timeline = [
      ...appointments.map((a) => ({ type: 'appointment', date: a.date, data: a })),
      ...prescriptions.map((p) => ({ type: 'prescription', date: p.createdAt, data: p })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ patient, appointments, prescriptions, timeline });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch patient.' });
  }
};

export const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create({ ...req.body, createdBy: req.user.id });
    const populated = await Patient.findById(patient._id).populate('createdBy', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create patient.' });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('createdBy', 'name');
    if (!patient) return res.status(404).json({ message: 'Patient not found.' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update patient.' });
  }
};
