"use client";
import {
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "../Link";
import { FileWorkStatus, Work, WorkType } from "@/app/_lib/common-types/work";


// 一応仮
export default function WorksViewer() {
  const { data: works } = useQuery({
    queryKey: ["work"],
    queryFn: async () => {
      const res = await fetch("/api/work");
      const json: (Work & { status: FileWorkStatus })[] = await res.json();
      return json;
    },
  });

  const fileWorks = works?.filter((v) => v.type === WorkType.FILES);
  const textWorks = works?.filter((v) => v.type === WorkType.TEXT);
  const lyricsWorks = works?.filter((v) => v.type === WorkType.LYRICS);
  return (
    <Stack>
      <Accordion variant="outlined" expanded>
        <AccordionSummary expandIcon="↑">Files</AccordionSummary>
        <AccordionDetails>
          <ul>
            {fileWorks?.map((work) => (
              <li key={work.id}>
                <Typography
                  width="100%"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  noWrap
                >
                  <Link
                    linkProps={{ href: `/work/${work.id}` }}
                    sxProps={{
                      color: work.status === "processing" ? "red" : "",
                    }}
                  >
                    {work.title}
                  </Link>
                </Typography>
              </li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion variant="outlined" expanded>
        <AccordionSummary expandIcon="↑">Text</AccordionSummary>
        <AccordionDetails>
          <ul>
            {textWorks?.map((work) => (
              <li key={work.id}>
                <Typography
                  width="100%"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  noWrap
                >
                  <Link linkProps={{ href: `/work/${work.id}` }}>
                    {work.title}
                  </Link>
                </Typography>
              </li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion variant="outlined" expanded>
        <AccordionSummary expandIcon="↑">Lyrics</AccordionSummary>
        <AccordionDetails>
          <ul>
            {lyricsWorks?.map((work) => (
              <li key={work.id}>
                <Typography
                  width="100%"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  noWrap
                >
                  <Link linkProps={{ href: `/work/${work.id}` }}>
                    {work.title}
                  </Link>
                </Typography>
              </li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
