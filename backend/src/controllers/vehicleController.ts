import { Request, Response } from 'express';
import { Vehicle } from '../models/Vehicle';

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = new Vehicle({
      ...req.body,
      userId: req.userId,
    });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: 'Could not create vehicle' });
  }
};

export const getUserVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.userId });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch vehicles' });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: 'Could not update vehicle' });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete vehicle' });
  }
};
