import { useQuery } from "@tanstack/react-query";
import { neon } from "@/lib/neon-public";
import type { BlogPost } from "@/lib/db-types";

export type DbBlog = BlogPost;

export const useBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await neon
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as DbBlog[];
    },
  });
};

export const useBlog = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug");
      const { data, error } = await neon
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (error) throw error;
      return data as DbBlog;
    },
    enabled: !!slug,
  });
};
