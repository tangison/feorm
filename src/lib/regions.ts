/**
 * All 14 regions of Namibia, ordered alphabetically.
 * Use this single source of truth anywhere regions are needed.
 */
export const NAMIBIAN_REGIONS = [
  "Khomas",
  "Otjozondjupa",
  "Erongo",
  "Hardap",
  "Omaheke",
  "Karas",
  "Kunene",
  "Ohangwena",
  "Oshana",
  "Omusati",
  "Oshikoto",
  "Zambezi",
  "Kavango East",
  "Kavango West",
] as const;

/** ISO 3166-2:NA style short codes for each region (same order as NAMIBIAN_REGIONS). */
const REGION_CODES = [
  "KH", "OT", "ER", "HA", "OM",
  "KR", "KU", "OH", "OS", "OMU",
  "OK", "ZA", "KE", "KW",
] as const;

/** Regions with codes — useful for selection grids and API payloads. */
export const NAMIBIAN_REGIONS_WITH_CODES = NAMIBIAN_REGIONS.map(
  (name, i) => ({ name, code: REGION_CODES[i] })
);
