import { useQuery } from "@tanstack/react-query";
import { neon } from "@/lib/neon-public";
import type { Project } from "@/lib/db-types";

export type DbProject = Project;

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await neon
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbProject[];
    },
  });
};

export const useProject = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug");
      const { data, error } = await neon
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (error) throw error;
      return data as DbProject;
    },
    enabled: !!slug,
  });
};
