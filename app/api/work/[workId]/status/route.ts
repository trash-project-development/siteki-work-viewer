import { FileWorkStatus } from "@/app/_lib/common-types/work";
import prisma from "@/app/_lib/prisma/client";
import { NextResponse } from "next/server";

export async function GET(_: any, { params }: { params: { workId: string } }) {
  const workId = params.workId;
  const fileWork = await prisma.fileWork.findUnique({ where: { workId } });
  if (!fileWork) return new NextResponse(null, { status: 404 });
  return NextResponse.json({ status: fileWork.status });
}
