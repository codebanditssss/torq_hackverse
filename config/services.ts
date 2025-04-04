export const serviceConfig = {
  fuel: {
    basePrice: 50,
    pricePerUnit: 5, // per gallon
    estimatedTime: 30, // minutes
    types: ['gasoline', 'diesel'] as const,
    maxAmount: {
      gasoline: 5, // gallons
      diesel: 10, // gallons
    },
  },
  battery: {
    basePrice: 75,
    estimatedTime: 25,
    issues: [
      { value: 'dead_battery', label: 'Dead Battery' },
      { value: 'corroded_terminals', label: 'Corroded Terminals' },
      { value: 'faulty_alternator', label: 'Faulty Alternator' },
      { value: 'other', label: 'Other' },
    ],
    commonBatteryTypes: [
      '12V Lead-acid',
      '12V AGM',
      '12V Lithium-ion',
      '6V Lead-acid',
      'Other',
    ],
  },
  tire: {
    basePrice: 65,
    spareTirePrice: 40,
    estimatedTime: 35,
    issues: [
      { value: 'flat_tire', label: 'Flat Tire' },
      { value: 'puncture', label: 'Puncture' },
      { value: 'blowout', label: 'Blowout' },
      { value: 'other', label: 'Other' },
    ],
    locations: [
      { value: 'front_left', label: 'Front Left' },
      { value: 'front_right', label: 'Front Right' },
      { value: 'rear_left', label: 'Rear Left' },
      { value: 'rear_right', label: 'Rear Right' },
      { value: 'spare', label: 'Spare' },
    ],
  },
  tow: {
    basePrice: 100,
    pricePerKm: 10,
    estimatedTime: 45,
    reasons: [
      { value: 'accident', label: 'Accident' },
      { value: 'mechanical_failure', label: 'Mechanical Failure' },
      { value: 'illegal_parking', label: 'Illegal Parking' },
      { value: 'other', label: 'Other' },
    ],
    destinationTypes: [
      { value: 'repair_shop', label: 'Repair Shop' },
      { value: 'home', label: 'Home' },
      { value: 'dealer', label: 'Dealer' },
      { value: 'other', label: 'Other' },
    ],
  },
  lockout: {
    basePrice: 60,
    keyReplacementPrice: 40,
    estimatedTime: 20,
    types: [
      { value: 'keys_locked_in', label: 'Keys Locked In' },
      { value: 'lost_keys', label: 'Lost Keys' },
      { value: 'broken_key', label: 'Broken Key' },
      { value: 'faulty_lock', label: 'Faulty Lock' },
      { value: 'other', label: 'Other' },
    ],
  },
};
