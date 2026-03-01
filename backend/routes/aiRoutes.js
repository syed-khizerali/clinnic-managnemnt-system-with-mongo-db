import express from 'express';
import { assist, explainPrescription } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { adminOrDoctor, staffOnly } from '../middleware/rbac.js';
import { requireProPlan } from '../middleware/subscription.js';

const router = express.Router();

router.post('/assist', protect, adminOrDoctor, requireProPlan, assist);
router.post('/explain-prescription', protect, staffOnly, requireProPlan, explainPrescription);

export default router;
