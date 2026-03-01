import express from 'express';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';
import { staffOnly } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.post('/', protect, createAppointment);
router.put('/:id', protect, staffOnly, updateAppointment);
router.delete('/:id', protect, cancelAppointment);

export default router;
