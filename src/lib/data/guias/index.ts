import type { Guide } from "@/lib/types";
import { base } from "./base";
import { nuevas } from "./nuevas";

export const guides: Guide[] = [...base, ...nuevas];

export const guideBySlug = new Map(guides.map((g) => [g.slug, g]));
