export const mimeTypeMap: { [key: string]: string } = {
  ts: "application/typescript",
};

export function arbitrarilyMimeType(file: File) {
  const splittedFileName = file.name.split(".");
  if (splittedFileName.length <= 1) return file.type;
  const ext = splittedFileName.at(-1);
  if (!ext) return file.type;
  const mappedExt = mimeTypeMap[ext];
  if (mappedExt) {
    return mappedExt;
  } else {
    return file.type;
  }
}
