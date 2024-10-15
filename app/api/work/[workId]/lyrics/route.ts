import prisma from "@/app/_lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { APILyrics } from "../../type";
import { isLoggedIn } from "@/app/_lib/login/isLoggedIn";

export async function GET(
  req: NextRequest,
  { params }: { params: { workId: string } }
) {
  const workId = params.workId;
  const lyricsWork = await prisma.lyricsWork.findUnique({ where: { workId } });
  if (!lyricsWork) return new NextResponse(null, { status: 404 });
  return NextResponse.json({
    originalSongName: lyricsWork.originalSongName,
    originalSongURL: lyricsWork.originalSongURL,
    lyrics: lyricsWork.lyrics,
  } as APILyrics);
}
