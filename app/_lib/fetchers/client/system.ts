import { SystemFileInfo } from "@/app/api/system/info/file/route";

export async function fetchServerFilesInfo() {
  const res = await fetch("/api/system/info/file");
  const json = await res.json();
  return json as SystemFileInfo;
}
