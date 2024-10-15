import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("jw-url", req.url);
  requestHeaders.set("jw-pathname", req.nextUrl.pathname);

  if (req.headers.get("User-Agent")?.includes("bot") && req.method === "GET") {
    if (process.env.NODE_ENV === "development") console.log("Bot Request");
    return NextResponse.redirect(
      new URL(
        `metadata${req.nextUrl.pathname}`,
        `${req.nextUrl.protocol}//${req.nextUrl.host}`
      )
    );
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
