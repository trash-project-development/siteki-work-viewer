import prisma from "@/app/_lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { workId: string } }) {
  const workId = params.workId;
  const rows = await prisma.workAuthor.findMany({
    where: { workId },
    select: { user: true },
  });
  const filteredUser = rows.map((v) => {
    const unixtime = Math.floor(v.user.createdAt.getTime() / 1000);
    return {
      id: v.user.id,
      name: v.user.name,
      image: v.user.image,
      createdAt: unixtime,
    };
  });
  return NextResponse.json(filteredUser);
}
