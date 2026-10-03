import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...inputs) {
  return twMerge(clsx(inputs));
}

export const focusRing = [
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  "outline-blue-500",
];
