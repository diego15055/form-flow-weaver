import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  // Garantir que o twMerge funcione corretamente com Tailwind v4
  return twMerge(clsx(inputs))
}
