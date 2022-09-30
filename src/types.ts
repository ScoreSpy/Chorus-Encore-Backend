export enum ChartFormat {
  MIDI = 1,
  CHART = 2
}

export enum InstrumentFlags {
  None = 0,
  Guitar = 1 << 0,
  bass = 1 << 1,
  rhythm = 1 << 2,
  keys = 1 << 3,
  drums = 1 << 4,
  guitarghl = 1 << 5,
  bassghl = 1 << 6
}

export enum DifficultyFlags {
  None = 0,
  Easy = 1 << 0,
  Medium = 1 << 1,
  Hard = 1 << 2,
  Expert = 1 << 3
}

export type ChorusDiffMapString = {
  x: string;
  h: string;
  m: string;
  e: string;
}

export type ChorusDiffMapNumber = {
  x: number;
  h: number;
  m: number;
  e: number;
}

export type ChorusDiffMapBoolean = {
  x: boolean;
  h: boolean;
  m: boolean;
  e: boolean;
}
