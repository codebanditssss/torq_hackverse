import express from 'express';
import { auth } from '../middleware/auth';
import {
  createService,
  getUserServices,
  updateServiceStatus,
  getNearbyServices,
  getServiceDetails,
} from '../controllers/serviceController';

const router = express.Router();

router.use(auth);

router.post('/', createService);
router.get('/', getUserServices);
router.get('/nearby', getNearbyServices);
router.get('/:id', getServiceDetails);
router.put('/:id/status', updateServiceStatus);

export default router;
