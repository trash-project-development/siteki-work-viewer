import { NextResponse } from "next/server";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

export interface SystemFileInfo {
  fileWork: {
    size: number;
    count: number;
  };
}

export async function GET() {
  try {
    await fs.stat("./work_assets/file_work");
  } catch {
    return NextResponse.json({
      fileWork: {
        count: 0,
        size: 0,
      },
    } as SystemFileInfo);
  }

  const fileWorks = await fs.readdir("./work_assets/file_work");
  let fileWorkSize = 0;
  for (const fileWork of fileWorks) {
    const file = await fs.stat(`./work_assets/file_work/${fileWork}`);
    if (!file.isFile()) return;
    fileWorkSize += file.size;
  }

  return NextResponse.json({
    fileWork: {
      count: fileWorks.length,
      size: fileWorkSize,
    },
  } as SystemFileInfo);
}
