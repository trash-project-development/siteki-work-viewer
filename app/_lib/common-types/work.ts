export enum WorkType {
  LYRICS = "Lyrics",
  FILES = "Files",
  TEXT = "Text",
}

export interface Work {
  id: string;
  title: string;
  description?: string;
  type: WorkType;
  createdAt: number;
}

export interface TextWorkInfo {
  text: string;
}

export interface LyricsWorkInfo {
  originalSongName: string;
  originalSongURL?: string;
  lyrics: string;
}

export type FileWorkStatus = "processing" | "ok";
