import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/_lib/prisma/client";
import { isLoggedIn } from "@/app/_lib/login/isLoggedIn";

export async function GET(
  req: NextRequest,
  { params }: { params: { workId: string } }
) {
  const workId = params.workId;
  const row = await prisma.textWork.findUnique({ where: { workId: workId } });
  if (!row) return new NextResponse(null, { status: 404 });
  return NextResponse.json(row);
}
