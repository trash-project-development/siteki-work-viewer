// 作品を作成するときに使う型
export interface CreatingWork {
  title: string;
  description: string;
  tagIds: string[];
}

export interface CreatingWorkFile {
  file: File;
  displayName: string;
  key: string;
}

export interface FilesWork extends CreatingWork {
  files: CreatingWorkFile[];
}

export interface TextWork extends CreatingWork {
  isTopToBottom: boolean;
  text: string;
}

export interface LyricsWork extends CreatingWork {
  lyrics: string;
}
