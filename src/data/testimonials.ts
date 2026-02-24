export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  content: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ankit Agrawal",
    designation: "Business Owner, Delhi",
    content: "CHASE2SUCCESS made my first real estate investment seamless and highly rewarding. Their transparency and market knowledge gave me complete confidence. My plot has already appreciated 40% in just two years.",
    rating: 5,
  },
  {
    id: "2",
    name: "Priya Sharma",
    designation: "Senior Executive, Gurugram",
    content: "The team's dedication to finding the perfect farmhouse for our family was exceptional. From legal verification to handover, every step was handled with professionalism. We couldn't be happier with our Golden Acres villa.",
    rating: 5,
  },
  {
    id: "3",
    name: "Akshat Singhal",
    designation: "NRI Investors, Dubai",
    content: "Investing from abroad was worry-free with CHASE2SUCCESS. Their end-to-end support, video calls for site visits, and transparent documentation made it feel like we were right there. Outstanding service.",
    rating: 5,
  },
  {
    id: "4",
    name: "Dr. Kavita Singh",
    designation: "Healthcare Professional, Mumbai",
    content: "What sets CHASE2SUCCESS apart is their genuine advisory approach. They didn't just sell me a property — they helped me build an investment portfolio that aligns with my financial goals. Truly premium service.",
    rating: 5,
  },
];
