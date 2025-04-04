import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  vin: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
