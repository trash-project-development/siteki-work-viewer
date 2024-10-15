import { Tag } from "@/app/_lib/common-types/tag";
import { Work } from "@/app/_lib/common-types/work";
import { getTag } from "@/app/_lib/fetchers/server/tag";
import { getWork } from "@/app/_lib/fetchers/server/work";
import { Metadata } from "next";

export async function generateMetadata({
  params: { pathContext },
}: {
  params: { pathContext: string[] };
}): Promise<Metadata | undefined> {
  const [type, ...otherPaths] = pathContext;
  if (type === "work" && !!otherPaths[0]) {
    const workId = otherPaths[0];
    const workInfo = await getWork(workId);
    if (!workInfo) return undefined;
    return getWorkPageMetadata(workInfo);
  }
  if (type === "tag" && !!otherPaths[0]) {
    const tagId = otherPaths[0];
    const tagInfo = await getTag(tagId);
    if (!tagInfo) return undefined;
    return getTagPageMetadata(tagInfo);
  }
  if (type === "create") {
    return getWorkCreatePageMetadata();
  }
  if (type === "all-works") return getAllWorksPageMetadata();
  if (type === "upload-status") return getUploadStatusPageMetadata();
  if (type === "search") return getSearchPageMetadata();
  return undefined;
}

export default async function Page() {
  return null;
}

function getWorkPageMetadata(workInfo: Work): Metadata {
  const titleEllipseLength = 24;
  const descriptionEllpiseLength = 50;

  const ellipsedTitle =
    workInfo.title.length > titleEllipseLength
      ? workInfo.title.slice(0, titleEllipseLength) + "..."
      : workInfo.title;

  const ellipsedDescription = !!workInfo?.description
    ? workInfo.description.length > descriptionEllpiseLength
      ? workInfo.description.slice(0, descriptionEllpiseLength) + "..."
      : workInfo.description
    : undefined;
  return {
    title: ellipsedTitle,
    description: ellipsedDescription,
    openGraph: {
      title: ellipsedTitle + ` | ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: ellipsedDescription,
      images: [`/metadata/opengraph-image/work/${workInfo.id}`],
    },
  };
}

async function getTagPageMetadata(tagInfo: Tag): Promise<Metadata> {
  return {
    title: `タグ「${tagInfo.name}」`,
    description: `タグ「${tagInfo.name} 」のすべての作品`,
    openGraph: {
      title: `タグ「${tagInfo.name}」の作品 | ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: `タグ「${tagInfo.name}」のすべての作品`,
      images: ["/icon512_maskable.png"],
    },
  };
}

function getWorkCreatePageMetadata() {
  return {
    title: "作品作成",
    description: `Throw away your work into ${process.env.NEXT_PUBLIC_APP_NAME}`,
    openGraph: {
      title: `作品作成 | ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: `Throw away your work into ${process.env.NEXT_PUBLIC_APP_NAME}`,
      images: ["/icon512_maskable.png"],
    },
  };
}

function getAllWorksPageMetadata(): Metadata {
  return {
    title: "すべての作品",
    description: `${process.env.NEXT_PUBLIC_APP_NAME}に投稿されたすべての作品`,
    openGraph: {
      title: `すべての作品 | ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: `${process.env.NEXT_PUBLIC_APP_NAME}に投稿されたすべての作品`,
      images: ["/icon512_maskable.png"],
    },
  };
}

function getUploadStatusPageMetadata(): Metadata {
  return {
    title: "アップロードの進行状況",
    description: `現在アップロードしているファイル`,
    openGraph: {
      title: `アップロードの進行状況 | ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: `現在アップロードしているファイル`,
      images: ["/icon512_maskable.png"],
    },
  };
}

function getSearchPageMetadata(): Metadata {
  return {
    title: "検索",
    openGraph: {
      title: `検索 | ${process.env.NEXT_PUBLIC_APP_NAME}`,
      images: ["/icon512_maskable.png"],
    },
  };
}
