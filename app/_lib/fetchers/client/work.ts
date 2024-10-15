import { Work, Tag } from "@prisma/client";
import { User } from "next-auth";
import { WorkFile } from "../../common-types/file";
import { TextWorkInfo, LyricsWorkInfo, FileWorkStatus } from "../../common-types/work";

export async function fetchWork(workId: string): Promise<Work | undefined> {
  const res = await fetch(`/api/work/${workId}/`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return undefined;
  }
  const json: Work = await res.json();
  return json;
}

export async function fetchWorkTags(
  workId: string
): Promise<Tag[] | undefined> {
  const res = await fetch(`/api/work/${workId}/tags`, {
    cache: "no-store",
  });
  const json: Tag[] = await res.json();
  return json;
}

export async function fetchWorkAuthors(
  workId: string
): Promise<User[] | undefined> {
  const res = await fetch(`/api/work/${workId}/authors`, {
    cache: "no-store",
  });
  const json: User[] = await res.json();
  return json;
}

export async function fetchWorkFiles(
  workId: string
): Promise<WorkFile[] | undefined> {
  const res = await fetch(`/api/work/${workId}/files`, {
    cache: "no-store",
  });
  if (!res.ok) return undefined;
  const json: WorkFile[] = await res.json();
  return json;
}

export async function fetchTextWork(
  workId: string
): Promise<TextWorkInfo | undefined> {
  const res = await fetch(`/api/work/${workId}/text`, {
    cache: "no-store",
  });
  if (!res.ok) return undefined;
  const json: TextWorkInfo = await res.json();
  return json;
}

export async function fetchLyricsWork(workId: string) {
  const res = await fetch(`/api/work/${workId}/lyrics`, {
    cache: "no-store",
  });
  if (!res.ok) return undefined;
  const json: LyricsWorkInfo = await res.json();
  return json;
}

export async function fetchWorkStatus(
  workId: string
): Promise<FileWorkStatus | undefined> {
  const res = await fetch(`/api/work/${workId}/status`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return undefined;
  }
  const json: { status: FileWorkStatus } = await res.json();
  return json.status;
}
