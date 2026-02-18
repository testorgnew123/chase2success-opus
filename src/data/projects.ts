import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";

export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  amenities: string[];
  type: string;
  status: string;
  area: string;
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "royal-greens-luxury-plots",
    name: "Royal Greens Luxury Plots",
    location: "Sector 150, Noida Expressway",
    price: "₹45 Lac Onwards",
    description: "Royal Greens Luxury Plots offer an exclusive opportunity to own premium land in one of the most sought-after locations along the Noida Expressway. Spread across 25 acres of meticulously planned landscape, each plot is designed to provide the perfect canvas for your dream home. With wide internal roads, dedicated green spaces, and world-class infrastructure, Royal Greens sets the gold standard for luxury plot investments.",
    shortDescription: "Premium plots in a gated community with world-class infrastructure and lush green surroundings.",
    image: project1,
    gallery: [project1, project1, project1],
    amenities: ["Gated Community", "24/7 Security", "Landscaped Gardens", "Club House", "Swimming Pool", "Jogging Track", "Children's Play Area", "Underground Electrification"],
    type: "Luxury Plots",
    status: "Ready to Move",
    area: "200-500 sq. yards",
  },
  {
    id: "2",
    slug: "golden-acres-farm-villas",
    name: "Golden Acres Farm Villas",
    location: "Sohna Road, Gurugram",
    price: "₹1.2 Cr Onwards",
    description: "Golden Acres Farm Villas present an extraordinary blend of luxury living and nature's tranquility. Nestled along the scenic Sohna Road corridor, these expansive farm villas offer private gardens, swimming pools, and panoramic views of the Aravalli hills. Each villa is architecturally designed to maximize natural light and ventilation while providing complete privacy and security.",
    shortDescription: "Expansive farm villas with private gardens and panoramic Aravalli views.",
    image: project2,
    gallery: [project2, project2, project2],
    amenities: ["Private Garden", "Swimming Pool", "Organic Farm", "Horse Riding", "Spa & Wellness", "Helipad Access", "Concierge Service", "Wine Cellar"],
    type: "Farm Villas",
    status: "Under Construction",
    area: "1-5 Acres",
  },
  {
    id: "3",
    slug: "elite-heights-residences",
    name: "Elite Heights Residences",
    location: "Golf Course Road, Gurugram",
    price: "₹2.5 Cr Onwards",
    description: "Elite Heights Residences redefine ultra-luxury apartment living on Golf Course Road. These sky residences feature floor-to-ceiling glass walls, private elevators, and smart home automation. With only two apartments per floor, residents enjoy unparalleled privacy and breathtaking views of the city skyline. The building features India's tallest residential infinity pool and a rooftop observatory.",
    shortDescription: "Ultra-luxury sky residences with private elevators and panoramic city views.",
    image: project3,
    gallery: [project3, project3, project3],
    amenities: ["Private Elevator", "Infinity Pool", "Sky Lounge", "Smart Home", "Concierge", "Valet Parking", "Private Theater", "Rooftop Observatory"],
    type: "Luxury Residences",
    status: "Booking Open",
    area: "3500-7000 sq. ft.",
  },
  {
    id: "4",
    slug: "signature-crest-towers",
    name: "Signature Crest Towers",
    location: "Dwarka Expressway, Delhi NCR",
    price: "₹85 Lac Onwards",
    description: "Signature Crest Towers stand as an architectural marvel on the Dwarka Expressway, offering premium 3 and 4 BHK apartments designed for the discerning homebuyer. The twin towers feature a distinctive gold-and-glass facade that catches the light beautifully at every hour. With proximity to the upcoming diplomatic enclave and international airport, this is an investment that promises exceptional returns.",
    shortDescription: "Premium towers with distinctive architecture on Dwarka Expressway.",
    image: project4,
    gallery: [project4, project4, project4],
    amenities: ["Rooftop Garden", "Business Center", "Indoor Games", "Gymnasium", "Meditation Zone", "EV Charging", "Solar Powered", "Rainwater Harvesting"],
    type: "Premium Apartments",
    status: "Under Construction",
    area: "1800-3200 sq. ft.",
  },
  {
    id: "5",
    slug: "imperial-estate-enclave",
    name: "Imperial Estate Enclave",
    location: "Greater Noida West",
    price: "₹3.5 Cr Onwards",
    description: "Imperial Estate Enclave is the epitome of grand living, offering palatial villas in a gated township spread across 50 acres. Each villa is crafted with Italian marble, teak wood interiors, and features a private courtyard with a water feature. The enclave includes a private golf course, equestrian club, and an exclusive members-only clubhouse that rivals the finest resorts.",
    shortDescription: "Palatial villas in a 50-acre gated township with private golf course.",
    image: project5,
    gallery: [project5, project5, project5],
    amenities: ["Private Golf Course", "Equestrian Club", "Italian Marble", "Private Courtyard", "Home Theater", "Wine Cellar", "Guest House", "Staff Quarters"],
    type: "Palatial Villas",
    status: "Limited Units",
    area: "5000-12000 sq. ft.",
  },
];
