import { revalidateTag } from "next/cache";
import { ImageSize } from "../../common-types/file";

export async function fetchDimension(fileId: string) {
  const res = await fetch(`/api/file/${fileId}/dimension`);
  if (!res.ok) return;
  const json: ImageSize = await res.json();
  return json;
}
