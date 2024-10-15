import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/_lib/prisma/client";
import { FileWorkStatus, Work } from "@/app/_lib/common-types/work";

export async function GET(req: NextRequest) {
  const works = (
    await prisma.work.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        createdAt: true,
        Files: { select: { status: true } },
      },
    })
  ).map((v) => {
    const { createdAt, Files, ...others } = v;
    const unixTime = Math.floor(createdAt.getTime() / 1000);
    return {
      createdAt: unixTime,
      status: Files?.status ?? "ok",
      ...others,
    };
  }) as (Work & { status: FileWorkStatus })[];
  return NextResponse.json(works);
}
