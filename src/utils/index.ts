import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: (string | boolean | undefined)[]) {
  return twMerge(inputs.filter(Boolean).join(" "));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createId(mock?: string) {
  return mock || uuidv4();
}
