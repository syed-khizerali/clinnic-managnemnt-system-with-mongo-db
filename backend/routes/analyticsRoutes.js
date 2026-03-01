import express from 'express';
import { getAdminAnalytics, getDoctorAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly, doctorOnly } from '../middleware/rbac.js';

const router = express.Router();

router.get('/admin', protect, adminOnly, getAdminAnalytics);
router.get('/doctor', protect, doctorOnly, getDoctorAnalytics);

export default router;
