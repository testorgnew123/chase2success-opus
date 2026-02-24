import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "sold out":
      return "status-badge-sold-out";
    case "booking":
      return "status-badge-booking";
    case "upcoming":
      return "status-badge-upcoming";
    default:
      return "gold-gradient text-primary-foreground";
  }
}
