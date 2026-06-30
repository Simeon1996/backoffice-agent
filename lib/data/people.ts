import type { Person } from "./types";

export const PEOPLE: Person[] = [
  { id: "acme", name: "Acme Industrial", org: "Acme Industrial Co.", role: "Supplier" },
  { id: "lumen", name: "Lumen Logistics", org: "Lumen Logistics LLC", role: "Supplier" },
  { id: "brightline", name: "Brightline Legal", org: "Brightline LLP", role: "Counterparty" },
  { id: "dana", name: "Dana Whitfield", org: "Northwind", role: "Operations" },
  { id: "marco", name: "Marco Reyes", org: "Northwind", role: "Engineering" },
  { id: "priya", name: "Priya Anand", org: "Northwind", role: "People Ops" },
  { id: "claimant-ortiz", name: "L. Ortiz", org: "Policyholder", role: "Claimant" },
];

const P_MAP = new Map(PEOPLE.map((p) => [p.id, p]));
export const personById = (id: string): Person | undefined => P_MAP.get(id);
