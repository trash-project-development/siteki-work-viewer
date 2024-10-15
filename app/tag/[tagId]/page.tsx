import Link from "@/app/_components/Link";
import Section from "@/app/_components/Section";
import { Work } from "@/app/_lib/common-types/work";
import { getTag } from "@/app/_lib/fetchers/server/tag";
import { getBaseURL, getPathname } from "@/app/_lib/util/ssr-url";
import { Typography } from "@mui/material";

export async function generateMetadata({
  params: { tagId },
}: {
  params: { tagId: string };
}) {
  const tag = await getTag(tagId);
  if(!tag) return;
  return {
    title: `タグ - ${tag.name}`
  }
}

export default async function TagPage({
  params: { tagId },
}: {
  params: { tagId: string };
}) {
  const tagInfo = await getTag(tagId);
  const baseURL = getBaseURL();
  const workRes = await fetch(new URL(`/api/work/tag/${tagId}`, baseURL));
  let works: Work[] | undefined = undefined;
  try {
    works = await workRes.json();
  } catch {
    // hold his cock
  }
  return (
    <Section>
      <Typography variant="h2" fontSize="2em">
        タグ「{tagInfo?.name}」の作品
      </Typography>
      <ul>
        {works?.map((work) => (
          <li key={work.id}>
            <Link linkProps={{ href: `/work/${work.id}` }}>{work.title}</Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
