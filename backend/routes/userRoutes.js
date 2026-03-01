import express from 'express';
import {
  getUsers,
  getDoctors,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly, staffOnly } from '../middleware/rbac.js';

const router = express.Router();

router.get('/doctors', protect, staffOnly, getDoctors);
router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;
