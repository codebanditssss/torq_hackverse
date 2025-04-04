import express from 'express';
import { auth } from '../middleware/auth';
import {
  createVehicle,
  getUserVehicles,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController';

const router = express.Router();

router.use(auth);

router.post('/', createVehicle);
router.get('/', getUserVehicles);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;
