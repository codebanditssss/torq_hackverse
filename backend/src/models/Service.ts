import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  type: {
    type: String,
    enum: ['fuel', 'battery', 'tire', 'tow', 'lockout'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: {
      type: String,
      required: true,
    }
  },
  // Common fields
  description: String,
  price: Number,
  estimatedArrivalTime: Date,
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Fuel delivery specific fields
  fuelType: {
    type: String,
    enum: ['gasoline', 'diesel'],
    required: function() { return this.type === 'fuel'; }
  },
  fuelAmount: {
    type: Number,
    required: function() { return this.type === 'fuel'; }
  },
  
  // Battery service specific fields
  batteryType: {
    type: String,
    required: function() { return this.type === 'battery'; }
  },
  batteryIssue: {
    type: String,
    enum: ['dead_battery', 'corroded_terminals', 'faulty_alternator', 'other'],
    required: function() { return this.type === 'battery'; }
  },
  
  // Tire service specific fields
  tireIssue: {
    type: String,
    enum: ['flat_tire', 'puncture', 'blowout', 'other'],
    required: function() { return this.type === 'tire'; }
  },
  tireLocation: {
    type: String,
    enum: ['front_left', 'front_right', 'rear_left', 'rear_right', 'spare'],
    required: function() { return this.type === 'tire'; }
  },
  hasSpareTire: {
    type: Boolean,
    required: function() { return this.type === 'tire'; }
  },
  
  // Towing specific fields
  towReason: {
    type: String,
    enum: ['accident', 'mechanical_failure', 'illegal_parking', 'other'],
    required: function() { return this.type === 'tow'; }
  },
  destinationType: {
    type: String,
    enum: ['repair_shop', 'home', 'dealer', 'other'],
    required: function() { return this.type === 'tow'; }
  },
  destinationAddress: {
    type: String,
    required: function() { return this.type === 'tow'; }
  },
  
  // Lockout specific fields
  lockoutType: {
    type: String,
    enum: ['keys_locked_in', 'lost_keys', 'broken_key', 'faulty_lock', 'other'],
    required: function() { return this.type === 'lockout'; }
  },
  hasSpareKey: {
    type: Boolean,
    required: function() { return this.type === 'lockout'; }
  }
}, { timestamps: true });

serviceSchema.index({ location: '2dsphere' });

export const Service = mongoose.model('Service', serviceSchema);
