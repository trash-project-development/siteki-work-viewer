export interface WorkFile {
  id: string;
  displayName: string;
  fileName: string;
  fileURL: string;
  mime?: string;
  index: number;
}

export interface ImageSize {
  height: number;
  width: number;
}
