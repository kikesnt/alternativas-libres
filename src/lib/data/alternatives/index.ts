import type { Alternative } from "@/lib/types";
import { productividad } from "./productividad";
import { comunicacion } from "./comunicacion";
import { infraestructura } from "./infraestructura";

export const alternatives: Alternative[] = [
  ...productividad,
  ...comunicacion,
  ...infraestructura,
];

export const alternativeBySlug = new Map(
  alternatives.map((a) => [a.slug, a]),
);
