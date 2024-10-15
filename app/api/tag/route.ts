import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/_lib/prisma/client";

// タグの取得
export async function GET(req: NextRequest) {
  const searchQuery = req.nextUrl.searchParams.get("q");
  if (!searchQuery) {
    return NextResponse.json(await prisma.tag.findMany());
  }
  return NextResponse.json(
    await prisma.tag.findMany({
      where: { name: { contains: searchQuery } },
    })
  );
}
