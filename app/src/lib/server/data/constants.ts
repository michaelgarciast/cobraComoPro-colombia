export const SECTOR_ORDER = ['primario', 'secundario', 'terciario', 'cuaternario', 'quinario'] as const;
export const MAX_RECORDS = 500;
export const RECORDS_PER_RUN = 10;

export type SectorId = (typeof SECTOR_ORDER)[number];
