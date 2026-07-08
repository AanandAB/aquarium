import type { Variety } from "../schema";
import { img, gallery } from "./images";

export type FishSeed = {
  slug: string;
  name: string;
  sci?: string;
  cat: string; // category slug
  short: string;
  desc?: string;
  care?: string;
  origin?: string;
  t?: [number, number]; // temp min/max °C
  ph?: [number, number];
  diff?: "beginner" | "intermediate" | "advanced" | "expert";
  agg?: "peaceful" | "semi_aggressive" | "aggressive";
  water?: "freshwater" | "brackish" | "marine";
  tank?: number; // litres
  size?: number; // cm
  life?: string;
  diet?: string;
  compat?: string;
  price: number;
  offer?: number;
  stock?: number;
  avail?: "available" | "low_stock" | "out_of_stock" | "reserved";
  varieties?: Variety[];
  feat?: boolean;
  trend?: boolean;
  imp?: boolean;
  nw?: boolean;
  tags?: string[];
  lock: number;
  kw: string; // image keywords
};

export { img, gallery };
