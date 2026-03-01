import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import AiUsageLog from '../models/AiUsageLog.js';
import mongoose from 'mongoose';

/**
 * @route   GET /api/analytics/admin
 * @desc    Admin dashboard analytics
 */
export const getAdminAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [
      totalPatients,
      totalDoctors,
      totalReceptionists,
      monthlyAppointments,
      prescriptionsThisMonth,
    ] = await Promise.all([
      Patient.countDocuments(),
      User.countDocuments({ role: 'doctor', isActive: true }),
      User.countDocuments({ role: 'receptionist', isActive: true }),
      Appointment.countDocuments({
        date: { $gte: startOfMonth, $lte: endOfMonth },
        status: { $ne: 'cancelled' },
      }),
      Prescription.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }),
    ]);

    // Most common diagnosis (from prescriptions)
    const diagnosisAgg = await Prescription.aggregate([
      { $match: { diagnosis: { $exists: true, $ne: '' } } },
      { $group: { _id: '$diagnosis', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // AI usage stats
    const aiUsageCount = await AiUsageLog.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Simulated revenue (e.g., 500 per appointment)
    const revenue = monthlyAppointments * 500;

    res.json({
      totalPatients,
      totalDoctors,
      totalReceptionists,
      monthlyAppointments,
      prescriptionsThisMonth,
      mostCommonDiagnosis: diagnosisAgg,
      revenue,
      aiUsageCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch analytics.' });
  }
};

/**
 * @route   GET /api/analytics/doctor
 * @desc    Doctor personal stats
 */
export const getDoctorAnalytics = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [dailyAppointments, monthlyAppointments, prescriptionCount, monthlyPrescriptions, aiUsageCount] =
      await Promise.all([
        Appointment.countDocuments({
          doctorId: new mongoose.Types.ObjectId(doctorId),
          date: { $gte: startOfDay },
          status: { $nin: ['cancelled'] },
        }),
        Appointment.countDocuments({
          doctorId: new mongoose.Types.ObjectId(doctorId),
          date: { $gte: startOfMonth },
          status: { $nin: ['cancelled'] },
        }),
        Prescription.countDocuments({ doctorId: new mongoose.Types.ObjectId(doctorId) }),
        Prescription.countDocuments({
          doctorId: new mongoose.Types.ObjectId(doctorId),
          createdAt: { $gte: startOfMonth },
        }),
        AiUsageLog.countDocuments({
          userId: new mongoose.Types.ObjectId(doctorId),
          createdAt: { $gte: startOfMonth },
        }),
      ]);

    res.json({
      dailyAppointments,
      monthlyAppointments,
      prescriptionCount,
      monthlyPrescriptions,
      aiUsageCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch analytics.' });
  }
};
