import Link from "@/app/_components/Link";
import { Work } from "@/app/_lib/common-types/work";
import { Box, Typography } from "@mui/material";

export default function WorkList({ works }: { works: Work[] }) {
  return (
    <Box display="flex" flexDirection="column" paddingX={2}>
      {works.map((work) => {
        const date = new Date(work.createdAt);
        return (
          <Box key={work.id}>
            <Typography sx={{ fontSize: "0.8em", color: "lightgray" }}>
              {date.getFullYear()}年 {date.getMonth() + 1}月 {date.getDate()}日{" "}
              {date.getHours()}時 {date.getMinutes()}分作成
            </Typography>
            <Typography sx={{ px: 1 }}>
              <Link linkProps={{ href: `/work/${work.id}` }}>{work.title}</Link>
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
