// types.ts
export interface DataEntry {
  _id: string;
  price?: number;
  allTimeHigh?: number;
  volume?: number;
  timestamp?: string;
}

export interface APIResponse {
  data: DataEntry[];
  pages: number;
}
