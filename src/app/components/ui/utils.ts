import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* O tailwind-merge precisa conhecer os tokens de tamanho de texto do DS (text-body, text-caption etc.); sem isso, ele os
   confundiria com cores (text-primary) e jogaria um deles fora ao juntar as classes. */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display-xl", "display-lg", "display-md", "h1", "h2", "h3", "h4", "subtitle-lg", "subtitle", "body-lg", "body", "body-sm", "button", "label", "caption"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
