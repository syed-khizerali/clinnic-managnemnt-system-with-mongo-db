import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';

export const getAppointments = async (req, res) => {
  try {
    const { status, doctorId, patientId, date } = req.query;
    const filter = {};

    if (req.user.role === 'doctor') filter.doctorId = req.user.id;
    else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ $or: [{ _id: req.user.patientId }, { userId: req.user.id }] });
      if (!patient) return res.json([]);
      filter.patientId = patient._id;
    }
    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name age gender contact')
      .populate('doctorId', 'name specialization')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch appointments.' });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name age gender contact email')
      .populate('doctorId', 'name specialization email');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch appointment.' });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({ ...req.body, createdBy: req.user.id });
    const populated = await Appointment.findById(appointment._id)
      .populate('patientId', 'name age gender contact')
      .populate('doctorId', 'name specialization');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create appointment.' });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('patientId', 'name age gender contact')
      .populate('doctorId', 'name specialization');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update appointment.' });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
    res.json({ message: 'Appointment cancelled.', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to cancel appointment.' });
  }
};
