import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import { generatePrescriptionPDF } from '../services/pdfService.js';

/**
 * @route   GET /api/prescriptions
 * @desc    Get prescriptions (filtered by role)
 */
export const getPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.query;
    const filter = {};

    if (req.user.role === 'doctor') {
      filter.doctorId = req.user.id;
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({
        $or: [{ _id: req.user.patientId }, { userId: req.user.id }],
      });
      if (!patient) return res.json([]);
      filter.patientId = patient._id;
    }
    if (patientId) filter.patientId = patientId;

    const prescriptions = await Prescription.find(filter)
      .populate('patientId', 'name age gender contact')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch prescriptions.' });
  }
};

/**
 * @route   GET /api/prescriptions/:id
 * @desc    Get prescription by ID
 */
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId', 'name age gender contact email')
      .populate('doctorId', 'name specialization');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found.' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({
        $or: [{ _id: req.user.patientId }, { userId: req.user.id }],
      });
      if (!patient || patient._id.toString() !== prescription.patientId._id.toString()) {
        return res.status(403).json({ message: 'Access denied.' });
      }
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch prescription.' });
  }
};

/**
 * @route   GET /api/prescriptions/:id/pdf
 * @desc    Download prescription as PDF
 */
export const downloadPrescriptionPDF = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId', 'name age gender contact')
      .populate('doctorId', 'name specialization');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found.' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({
        $or: [{ _id: req.user.patientId }, { userId: req.user.id }],
      });
      if (!patient || patient._id.toString() !== prescription.patientId._id.toString()) {
        return res.status(403).json({ message: 'Access denied.' });
      }
    }

    const pdfBuffer = await generatePrescriptionPDF(
      prescription,
      prescription.patientId,
      prescription.doctorId
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=prescription-${prescription._id}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to generate PDF.' });
  }
};

/**
 * @route   POST /api/prescriptions
 * @desc    Create prescription - Doctor only
 */
export const createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create({
      ...req.body,
      doctorId: req.user.id,
    });

    const populated = await Prescription.findById(prescription._id)
      .populate('patientId', 'name age gender contact')
      .populate('doctorId', 'name specialization');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create prescription.' });
  }
};

/**
 * @route   PUT /api/prescriptions/:id
 * @desc    Update prescription (e.g., add AI explanation)
 */
export const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found.' });
    }

    if (prescription.doctorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    Object.assign(prescription, req.body);
    await prescription.save();

    const updated = await Prescription.findById(prescription._id)
      .populate('patientId', 'name age gender contact')
      .populate('doctorId', 'name specialization');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update prescription.' });
  }
};
