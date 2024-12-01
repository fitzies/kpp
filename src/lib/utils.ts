import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateQrCode(value: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${value}`;
}
