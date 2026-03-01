import express from 'express';
import {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  downloadPrescriptionPDF,
} from '../controllers/prescriptionController.js';
import { protect } from '../middleware/auth.js';
import { adminOrDoctor } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', protect, getPrescriptions);
router.get('/:id', protect, getPrescriptionById);
router.get('/:id/pdf', protect, downloadPrescriptionPDF);
router.post('/', protect, adminOrDoctor, createPrescription);
router.put('/:id', protect, adminOrDoctor, updatePrescription);

export default router;
