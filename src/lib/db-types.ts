export interface Project {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: string;
  description: string;
  short_description: string;
  image_url: string;
  gallery: string[] | null;
  amenities: string[] | null;
  type: string;
  status: string;
  area: string;
  rera_number: string;
  brochure_url: string;
  map_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  category: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  project_name: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface PageVisit {
  id: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  visited_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "user";
}
