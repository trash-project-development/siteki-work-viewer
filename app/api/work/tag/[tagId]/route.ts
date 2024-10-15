import prisma from "@/app/_lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "@/app/_lib/login/isLoggedIn";
import { Work } from "@/app/_lib/common-types/work";

export async function GET(
  req: NextRequest,
  { params }: { params: { tagId: string } }
) {
  const works = (
    await prisma.work.findMany({
      where: { tags: { some: { tagId: params.tagId } } },
    })
  ).map((v) => {
    const { createdAt, ...others } = v;
    const unixTime = Math.floor(createdAt.getTime() / 1000);
    return {
      createdAt: unixTime,
      ...others,
    };
  }) as Work[];
  return NextResponse.json(works);
}
