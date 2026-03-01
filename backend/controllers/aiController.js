import { getDiagnosisAssist, getPrescriptionExplanation } from '../services/aiService.js';
import Prescription from '../models/Prescription.js';

/**
 * POST /api/ai/assist
 * Doctor sends symptoms → AI returns conditions, tests, treatment
 */
export const assist = async (req, res) => {
  try {
    const { symptoms, age, gender, history } = req.body;

    if (!symptoms || !age || !gender) {
      return res.status(400).json({
        message: 'Symptoms, age, and gender are required.',
      });
    }

    const result = await getDiagnosisAssist(
      req.user.id,
      req.user.clinicId,
      { symptoms, age, gender, history }
    );

    res.json({
      success: true,
      data: result,
      fallbackUsed: result.fallbackUsed || false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'AI assist failed.',
    });
  }
};

/**
 * POST /api/ai/explain-prescription
 * Generate simple language explanation for a prescription
 */
export const explainPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.body;

    if (!prescriptionId) {
      return res.status(400).json({ message: 'Prescription ID is required.' });
    }

    const prescription = await Prescription.findById(prescriptionId)
      .populate('patientId', 'name age')
      .populate('doctorId', 'name');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found.' });
    }

    const explanation = await getPrescriptionExplanation(
      req.user.id,
      req.user.clinicId,
      prescription.diagnosis,
      prescription.medicines
    );

    prescription.aiExplanation = explanation;
    await prescription.save();

    res.json({
      success: true,
      explanation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Explanation generation failed.',
    });
  }
};
