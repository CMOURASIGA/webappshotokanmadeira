import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata dinamicamente a lista de modalidades de um campeonato para exibição institucional e mensagens
 * Ex: ["Kata"] -> "Kata"
 * Ex: ["Kata", "Kumite"] -> "Kata e Kumite"
 * Ex: ["Kata", "Kumite", "Kobudo"] -> "Kata, Kumite e Kobudo"
 */
export function formatModalidadesList(modalidades?: string[]): string {
  if (!modalidades || modalidades.length === 0) return "Kata e Kumite";
  const cleaned = modalidades.map(m => m.trim()).filter(Boolean);
  if (cleaned.length === 0) return "Kata e Kumite";
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} e ${cleaned[1]}`;
  return `${cleaned.slice(0, -1).join(", ")} e ${cleaned[cleaned.length - 1]}`;
}
