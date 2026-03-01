import Clinic from '../models/Clinic.js';

export const getClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found.' });
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!clinic) return res.status(404).json({ message: 'Clinic not found.' });
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClinicSettings = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    if (clinicId) {
      const clinic = await Clinic.findById(clinicId);
      return res.json(clinic || { aiEnabled: true, subscriptionPlan: 'basic' });
    }
    res.json({ aiEnabled: true, subscriptionPlan: 'basic' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
