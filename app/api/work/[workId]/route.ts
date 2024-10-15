import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/_lib/prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { workId: string } }
) {
  // OGPの関係でここはわざと認証してない
  const id = params.workId;
  const row = await prisma.work.findUnique({
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      createdAt: true,
    },
    where: {
      id,
    },
  });
  if (!row) return new NextResponse(null, { status: 404 });
  const { createdAt, ...others } = row;
  const unixTime = Math.floor(createdAt.getTime() / 1000);
  const work = {
    createdAt: unixTime,
    ...others,
  };
  return NextResponse.json(work);
}
