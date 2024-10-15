import { TextWork } from "@prisma/client";

export type APIText = TextWork;

export type APILyrics = {
  originalSongName: string;
  originalSongURL?: string;
  lyrics: string;
};
