import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateInput: Date | string | number): string {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function getRoleBadge(roles: string[] = []): { label: string; colorClass: string } {
  if (roles.includes('admin')) {
    return { label: 'Admin', colorClass: 'bg-rose-50 text-rose-700 border-rose-200' };
  }
  if (roles.includes('subadmin')) {
    return { label: 'Staff', colorClass: 'bg-purple-50 text-purple-700 border-purple-200' };
  }
  if (roles.includes('mentor')) {
    return { label: 'Mentor', colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  }
  if (roles.includes('sponsor')) {
    return { label: 'Sponsor', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  return { label: 'Scholar', colorClass: 'bg-blue-50 text-blue-700 border-blue-200' };
}

export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
