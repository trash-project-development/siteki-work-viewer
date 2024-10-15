import { ImageResponse } from "next/og";
import prisma from "@/app/_lib/prisma/client";
import textKagikakko from "@/app/assets/kagikakko.svg";
import { WorkType } from "@/app/_lib/common-types/work";
import { getBaseURL } from "@/app/_lib/util/ssr-url";
import { WorkFile } from "@/app/_lib/common-types/file";
import { getWork } from "@/app/_lib/fetchers/server/work";
import { NextRequest } from "next/server";

const size = {
  width: 1200,
  height: 630,
};

export async function GET(
  req: NextRequest,
  { params: { workId } }: { params: { workId: string } }
) {
  const baseURL = getBaseURL();
  const workInfo = await getWork(workId);
  if (!workInfo) return;
  const workType = workInfo.type;
  let originalSong: string | undefined = "";
  if (workType === WorkType.LYRICS) {
    const lyricsWork = await prisma.lyricsWork.findUnique({
      where: { workId: workInfo.id },
    });
    originalSong = lyricsWork?.originalSongName;
  }
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          backgroundColor: "black",
          ...(workType === WorkType.TEXT && {
            backgroundImage: `url(${baseURL.slice(0, -1)}${
              textKagikakko.src
            })`,
          }),
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 900,
            height: 500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {workType === WorkType.FILES && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: 32,
                overflow: "hidden",
                width: "100%",
                height: "100%",
              }}
            >
              <h1>{workInfo.title}</h1>
            </div>
          )}
          {workType === WorkType.TEXT && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: 32,
                overflow: "hidden",
                width: "100%",
                height: "100%",
              }}
            >
              <h1 style={{ overflow: "hidden" }}>{workInfo.title}</h1>
            </div>
          )}
          {workType === WorkType.LYRICS && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                fontSize: 32,
                overflow: "hidden",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flex: 4,
                  alignItems: "flex-start",
                  overflow: "hidden",
                }}
              >
                <h1 style={{ margin: 0 }}>{workInfo.title}</h1>
              </div>
              {originalSong && (
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "flex-start",
                    overflow: "hidden",
                  }}
                >
                  <h2
                    style={{
                      whiteSpace: "nowrap",
                      color: "darkgray",
                    }}
                  >
                    原曲: {originalSong}
                  </h2>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
