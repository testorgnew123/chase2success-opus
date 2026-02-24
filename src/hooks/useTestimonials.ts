import { useQuery } from "@tanstack/react-query";
import { neon } from "@/lib/neon-public";
import type { Testimonial } from "@/lib/db-types";

export type DbTestimonial = Testimonial;

export const useTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await neon
        .from("testimonials")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbTestimonial[];
    },
  });
};
