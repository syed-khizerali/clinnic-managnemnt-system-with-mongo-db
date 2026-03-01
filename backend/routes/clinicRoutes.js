import express from 'express';
import { getClinic, updateClinic, getClinicSettings } from '../controllers/clinicController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/rbac.js';

const router = express.Router();

router.get('/settings', protect, getClinicSettings);
router.get('/:id', protect, adminOnly, getClinic);
router.put('/:id', protect, adminOnly, updateClinic);

export default router;
