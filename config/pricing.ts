interface PricingFactors {
  time: {
    peakHourMultiplier: number;
    peakHours: number[];
    offPeakDiscount: number;
  };
  distance: {
    baseDistance: number; // in km
    pricePerExtraKm: number;
  };
  demand: {
    highDemandMultiplier: number;
    lowDemandDiscount: number;
  };
  weather: {
    rainMultiplier: number;
    snowMultiplier: number;
  };
}

export const pricingConfig: PricingFactors = {
  time: {
    peakHourMultiplier: 1.25, // 25% extra during peak hours
    peakHours: [7, 8, 9, 17, 18, 19], // 7-9 AM and 5-7 PM
    offPeakDiscount: 0.9, // 10% discount during off-peak
  },
  distance: {
    baseDistance: 5, // first 5 km included in base price
    pricePerExtraKm: 2,
  },
  demand: {
    highDemandMultiplier: 1.3, // 30% extra during high demand
    lowDemandDiscount: 0.85, // 15% discount during low demand
  },
  weather: {
    rainMultiplier: 1.2, // 20% extra during rain
    snowMultiplier: 1.4, // 40% extra during snow
  },
};
