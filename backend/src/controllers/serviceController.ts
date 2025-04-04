import { Request, Response } from 'express';
import { Service } from '../models/Service';
import { serviceConfig } from '../config/services';
import { pricingConfig } from '../config/pricing';
import axios from 'axios';

const getWeatherConditions = async (latitude: number, longitude: number) => {
  try {
    // Using OpenWeatherMap API (you'll need to add your API key to .env)
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`
    );
    return response.data.weather[0].main.toLowerCase();
  } catch (error) {
    console.error('Weather API error:', error);
    return 'clear';
  }
};

const calculatePriceMultiplier = async (coordinates: [number, number]) => {
  const currentHour = new Date().getHours();
  const weather = await getWeatherConditions(coordinates[1], coordinates[0]);
  
  let multiplier = 1;

  // Time-based pricing
  if (pricingConfig.time.peakHours.includes(currentHour)) {
    multiplier *= pricingConfig.time.peakHourMultiplier;
  } else {
    multiplier *= pricingConfig.time.offPeakDiscount;
  }

  // Weather-based pricing
  if (weather.includes('rain')) {
    multiplier *= pricingConfig.weather.rainMultiplier;
  } else if (weather.includes('snow')) {
    multiplier *= pricingConfig.weather.snowMultiplier;
  }

  // TODO: Add demand-based pricing using real-time service request data
  
  return multiplier;
};

const calculateServicePrice = async (
  serviceType: keyof typeof serviceConfig,
  additionalFactors: any = {},
  coordinates: [number, number]
) => {
  const config = serviceConfig[serviceType];
  let basePrice = config.basePrice;

  switch (serviceType) {
    case 'fuel':
      basePrice += (additionalFactors.fuelAmount || 0) * config.pricePerUnit;
      break;
    case 'tire':
      if (!additionalFactors.hasSpareTire) {
        basePrice += config.spareTirePrice;
      }
      break;
    case 'tow':
      if (additionalFactors.distance > pricingConfig.distance.baseDistance) {
        const extraDistance = additionalFactors.distance - pricingConfig.distance.baseDistance;
        basePrice += extraDistance * pricingConfig.distance.pricePerExtraKm;
      }
      break;
    case 'lockout':
      if (additionalFactors.lockoutType === 'lost_keys') {
        basePrice += config.keyReplacementPrice;
      }
      break;
  }

  const multiplier = await calculatePriceMultiplier(coordinates);
  return Math.round(basePrice * multiplier);
};

const calculateEstimatedArrivalTime = async (
  serviceType: keyof typeof serviceConfig,
  coordinates: [number, number]
) => {
  const config = serviceConfig[serviceType];
  const baseTime = new Date();
  
  // Add base service time
  baseTime.setMinutes(baseTime.getMinutes() + config.estimatedTime);
  
  // Add weather delay if any
  const weather = await getWeatherConditions(coordinates[1], coordinates[0]);
  if (weather.includes('rain')) {
    baseTime.setMinutes(baseTime.getMinutes() + 10);
  } else if (weather.includes('snow')) {
    baseTime.setMinutes(baseTime.getMinutes() + 20);
  }
  
  // Add traffic delay during peak hours
  const currentHour = baseTime.getHours();
  if (pricingConfig.time.peakHours.includes(currentHour)) {
    baseTime.setMinutes(baseTime.getMinutes() + 15);
  }
  
  return baseTime;
};

export const createService = async (req: Request, res: Response) => {
  try {
    const serviceData = {
      ...req.body,
      userId: req.userId,
    };

    // Calculate dynamic price and ETA
    const price = await calculateServicePrice(
      serviceData.type,
      serviceData,
      serviceData.location.coordinates
    );
    
    const estimatedArrivalTime = await calculateEstimatedArrivalTime(
      serviceData.type,
      serviceData.location.coordinates
    );

    const service = new Service({
      ...serviceData,
      price,
      estimatedArrivalTime,
    });
    
    await service.save();
    
    const populatedService = await Service.findById(service._id)
      .populate('vehicleId')
      .populate('serviceProviderId', 'name phone');
      
    res.status(201).json(populatedService);
  } catch (error) {
    console.error('Service creation error:', error);
    res.status(400).json({ error: 'Could not create service request' });
  }
};

export const updateServiceStatus = async (req: Request, res: Response) => {
  try {
    const { status, serviceProviderId } = req.body;
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Recalculate ETA if status is 'accepted'
    const updates: any = {
      status,
      ...(serviceProviderId && { serviceProviderId }),
    };

    if (status === 'accepted') {
      updates.estimatedArrivalTime = await calculateEstimatedArrivalTime(
        service.type,
        service.location.coordinates
      );
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
    .populate('vehicleId')
    .populate('serviceProviderId', 'name phone');
    
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ error: 'Could not update service status' });
  }
};

export const getUserServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ userId: req.userId })
      .populate('vehicleId')
      .populate('serviceProviderId', 'name phone')
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch services' });
  }
};

export const getNearbyServices = async (req: Request, res: Response) => {
  try {
    const { longitude, latitude, maxDistance = 5000, type } = req.query;
    
    const query: any = {
      status: 'pending',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: Number(maxDistance),
        },
      },
    };

    if (type) {
      query.type = type;
    }

    const services = await Service.find(query)
      .populate('vehicleId')
      .populate('userId', 'name phone');
    
    // Update prices based on current conditions
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        const price = await calculateServicePrice(
          service.type,
          service,
          service.location.coordinates
        );
        return { ...service.toObject(), price };
      })
    );
    
    res.json(updatedServices);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch nearby services' });
  }
};

export const getServiceDetails = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('vehicleId')
      .populate('serviceProviderId', 'name phone')
      .populate('userId', 'name phone');
      
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    // Update price and ETA based on current conditions
    const price = await calculateServicePrice(
      service.type,
      service,
      service.location.coordinates
    );
    
    const estimatedArrivalTime = service.status === 'pending' 
      ? await calculateEstimatedArrivalTime(service.type, service.location.coordinates)
      : service.estimatedArrivalTime;
    
    res.json({
      ...service.toObject(),
      price,
      estimatedArrivalTime,
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch service details' });
  }
};
