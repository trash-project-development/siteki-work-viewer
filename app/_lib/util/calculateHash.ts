export async function calculateFileHash(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    console.log();
    return hashHex;
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

const DEFAUT_CHUNK_SIZE = 10 * 1024 * 1024;

export async function calculatePartialFileHash(
  file: File,
  chunkSize: number = DEFAUT_CHUNK_SIZE
) {
  const blob = file.slice(0, chunkSize);
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
