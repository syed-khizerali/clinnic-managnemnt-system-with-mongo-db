import express from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
} from '../controllers/patientController.js';
import { protect } from '../middleware/auth.js';
import { adminOrReceptionist, staffOnly } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', protect, getPatients);
router.get('/:id', protect, getPatientById);
router.post('/', protect, adminOrReceptionist, createPatient);
router.put('/:id', protect, staffOnly, updatePatient);

export default router;
