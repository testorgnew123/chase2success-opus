import {
  ShieldCheck, Trees, Waves, Home, Dumbbell, Car, Sparkles, Flower2, Wine,
  Theater, Eye, Zap, CloudRain, Sun, Gamepad2, BriefcaseBusiness, Fence, Baby,
  Droplets, Bike, Dog, Coffee, Wifi, Lock, Flame, Music, BookOpen, Heart,
  Footprints, Mountain, Umbrella, ParkingCircle, Landmark, Building2,
  UtensilsCrossed, Shirt, Paintbrush, Leaf, Globe, Shield, Tv, Bath,
  Refrigerator, AirVent, Lamp, Sofa, Banknote, Store, Bus, TrainFront,
  Plane, Anchor, CircleDot, TreePine, Hammer, Wrench, Phone, Mail,
  type LucideIcon,
} from "lucide-react";

export interface AmenityDef {
  name: string;
  icon: LucideIcon;
  category: "security" | "recreation" | "lifestyle" | "infrastructure" | "nature" | "wellness" | "transport" | "interior";
}

export const AMENITIES_LIST: AmenityDef[] = [
  // Security
  { name: "Gated Community", icon: Fence, category: "security" },
  { name: "24/7 Security", icon: ShieldCheck, category: "security" },
  { name: "CCTV Surveillance", icon: Eye, category: "security" },
  { name: "Intercom Facility", icon: Phone, category: "security" },
  { name: "Video Door Phone", icon: Lock, category: "security" },
  { name: "Fire Safety Systems", icon: Flame, category: "security" },
  { name: "Access Control", icon: Shield, category: "security" },

  // Recreation
  { name: "Swimming Pool", icon: Waves, category: "recreation" },
  { name: "Infinity Pool", icon: Waves, category: "recreation" },
  { name: "Children's Play Area", icon: Baby, category: "recreation" },
  { name: "Indoor Games", icon: Gamepad2, category: "recreation" },
  { name: "Outdoor Sports Court", icon: CircleDot, category: "recreation" },
  { name: "Tennis Court", icon: CircleDot, category: "recreation" },
  { name: "Badminton Court", icon: CircleDot, category: "recreation" },
  { name: "Basketball Court", icon: CircleDot, category: "recreation" },
  { name: "Cricket Net", icon: CircleDot, category: "recreation" },
  { name: "Table Tennis", icon: Gamepad2, category: "recreation" },
  { name: "Billiards Room", icon: Gamepad2, category: "recreation" },
  { name: "Private Theater", icon: Theater, category: "recreation" },
  { name: "Home Theater", icon: Theater, category: "recreation" },
  { name: "Mini Theater", icon: Theater, category: "recreation" },
  { name: "Amphitheatre", icon: Theater, category: "recreation" },
  { name: "Party Hall", icon: Music, category: "recreation" },
  { name: "Banquet Hall", icon: Music, category: "recreation" },
  { name: "Private Golf Course", icon: Trees, category: "recreation" },
  { name: "Equestrian Club", icon: Sparkles, category: "recreation" },
  { name: "Horse Riding", icon: Sparkles, category: "recreation" },

  // Wellness
  { name: "Gymnasium", icon: Dumbbell, category: "wellness" },
  { name: "Jogging Track", icon: Footprints, category: "wellness" },
  { name: "Walking Track", icon: Footprints, category: "wellness" },
  { name: "Cycling Track", icon: Bike, category: "wellness" },
  { name: "Spa & Wellness", icon: Heart, category: "wellness" },
  { name: "Sauna & Steam", icon: Droplets, category: "wellness" },
  { name: "Meditation Zone", icon: Sparkles, category: "wellness" },
  { name: "Yoga Deck", icon: Sparkles, category: "wellness" },
  { name: "Aerobics Room", icon: Dumbbell, category: "wellness" },

  // Lifestyle
  { name: "Club House", icon: Home, category: "lifestyle" },
  { name: "Sky Lounge", icon: Eye, category: "lifestyle" },
  { name: "Rooftop Lounge", icon: Eye, category: "lifestyle" },
  { name: "Rooftop Observatory", icon: Eye, category: "lifestyle" },
  { name: "Wine Cellar", icon: Wine, category: "lifestyle" },
  { name: "Cafeteria", icon: Coffee, category: "lifestyle" },
  { name: "Restaurant", icon: UtensilsCrossed, category: "lifestyle" },
  { name: "Shopping Arcade", icon: Store, category: "lifestyle" },
  { name: "Convenience Store", icon: Store, category: "lifestyle" },
  { name: "Library", icon: BookOpen, category: "lifestyle" },
  { name: "Reading Lounge", icon: BookOpen, category: "lifestyle" },
  { name: "Business Center", icon: BriefcaseBusiness, category: "lifestyle" },
  { name: "Co-Working Space", icon: BriefcaseBusiness, category: "lifestyle" },
  { name: "Conference Room", icon: BriefcaseBusiness, category: "lifestyle" },
  { name: "Concierge Service", icon: BriefcaseBusiness, category: "lifestyle" },
  { name: "Guest House", icon: Home, category: "lifestyle" },
  { name: "Staff Quarters", icon: Home, category: "lifestyle" },
  { name: "Pet Park", icon: Dog, category: "lifestyle" },
  { name: "Laundry Service", icon: Shirt, category: "lifestyle" },
  { name: "ATM", icon: Banknote, category: "lifestyle" },
  { name: "Salon", icon: Paintbrush, category: "lifestyle" },
  { name: "Creche / Day Care", icon: Baby, category: "lifestyle" },
  { name: "Senior Citizen Corner", icon: Umbrella, category: "lifestyle" },
  { name: "Helipad Access", icon: Plane, category: "lifestyle" },

  // Nature & Gardens
  { name: "Landscaped Gardens", icon: Flower2, category: "nature" },
  { name: "Private Garden", icon: Flower2, category: "nature" },
  { name: "Private Courtyard", icon: Flower2, category: "nature" },
  { name: "Rooftop Garden", icon: Flower2, category: "nature" },
  { name: "Terrace Garden", icon: Flower2, category: "nature" },
  { name: "Organic Farm", icon: Leaf, category: "nature" },
  { name: "Herbal Garden", icon: Leaf, category: "nature" },
  { name: "Tree-Lined Avenues", icon: TreePine, category: "nature" },
  { name: "Central Green", icon: Trees, category: "nature" },
  { name: "Water Bodies", icon: Anchor, category: "nature" },
  { name: "Fountain Plaza", icon: Droplets, category: "nature" },
  { name: "Butterfly Garden", icon: Flower2, category: "nature" },
  { name: "Open Lawn", icon: Trees, category: "nature" },
  { name: "Hill View", icon: Mountain, category: "nature" },

  // Infrastructure
  { name: "Underground Electrification", icon: Zap, category: "infrastructure" },
  { name: "Power Backup", icon: Zap, category: "infrastructure" },
  { name: "EV Charging", icon: Zap, category: "infrastructure" },
  { name: "Solar Powered", icon: Sun, category: "infrastructure" },
  { name: "Rainwater Harvesting", icon: CloudRain, category: "infrastructure" },
  { name: "Sewage Treatment Plant", icon: Droplets, category: "infrastructure" },
  { name: "Water Purification Plant", icon: Droplets, category: "infrastructure" },
  { name: "High Speed Internet", icon: Wifi, category: "infrastructure" },
  { name: "Smart Home", icon: Zap, category: "infrastructure" },
  { name: "Wide Roads", icon: Globe, category: "infrastructure" },
  { name: "Street Lighting", icon: Lamp, category: "infrastructure" },
  { name: "Waste Management", icon: Wrench, category: "infrastructure" },
  { name: "Gas Pipeline", icon: Flame, category: "infrastructure" },
  { name: "Piped Gas", icon: Flame, category: "infrastructure" },
  { name: "Lift / Elevator", icon: Building2, category: "infrastructure" },
  { name: "Private Elevator", icon: Building2, category: "infrastructure" },
  { name: "Service Elevator", icon: Building2, category: "infrastructure" },
  { name: "Mail Room", icon: Mail, category: "infrastructure" },

  // Transport & Parking
  { name: "Valet Parking", icon: Car, category: "transport" },
  { name: "Covered Parking", icon: ParkingCircle, category: "transport" },
  { name: "Multi-Level Parking", icon: ParkingCircle, category: "transport" },
  { name: "Visitor Parking", icon: ParkingCircle, category: "transport" },
  { name: "Shuttle Service", icon: Bus, category: "transport" },
  { name: "Metro Connectivity", icon: TrainFront, category: "transport" },

  // Interior / Finishes
  { name: "Italian Marble", icon: Sparkles, category: "interior" },
  { name: "Modular Kitchen", icon: Refrigerator, category: "interior" },
  { name: "Wooden Flooring", icon: Hammer, category: "interior" },
  { name: "Air Conditioning", icon: AirVent, category: "interior" },
  { name: "Furnished", icon: Sofa, category: "interior" },
  { name: "Semi-Furnished", icon: Sofa, category: "interior" },
  { name: "Home Automation", icon: Tv, category: "interior" },
  { name: "Jacuzzi", icon: Bath, category: "interior" },
  { name: "Balcony", icon: Landmark, category: "interior" },
  { name: "Large Windows", icon: Sun, category: "interior" },
  { name: "Walk-in Closet", icon: Shirt, category: "interior" },
];

// Build a lookup map (case-insensitive) for icon resolution
const amenityIconMap: Record<string, LucideIcon> = {};
AMENITIES_LIST.forEach((a) => {
  amenityIconMap[a.name.toLowerCase()] = a.icon;
});

export const getAmenityIcon = (amenity: string): LucideIcon =>
  amenityIconMap[amenity.toLowerCase()] || Sparkles;

export const AMENITY_NAMES = AMENITIES_LIST.map((a) => a.name);
