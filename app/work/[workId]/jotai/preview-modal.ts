import { atom } from "jotai";

export interface PreviewInfo {
  mimeType: string;
  url: string;
  size: {
    width: number;
    height: number;
  };
}

export const previewModalAtom = atom<PreviewInfo | undefined>(undefined);
