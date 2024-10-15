import { APILyrics } from "@/app/api/work/type";
import { Card, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "@/app/_components/Link";

export default function LyricsWorkViewer({ workId }: { workId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["work", workId, "lyrics"],
    queryFn: async () => {
      const res = await fetch(`/api/work/${workId}/lyrics/`);
      const json = await res.json();
      return json as APILyrics;
    },
  });
  if (isLoading) return <Typography>Loading...</Typography>;
  return (
    <Stack sx={{ my: 1 }}>
      <Card variant="outlined" sx={{ p: 2 }}>
        原曲:{" "}
        {data?.originalSongURL ? (
          <Link linkProps={{ href: data.originalSongURL }} target="__blank" rel="noopener noreferrer">
            {data.originalSongName}
          </Link>
        ) : (
          data?.originalSongName
        )}
      </Card>
      <Typography sx={{ whiteSpace: "pre-wrap" }}>
        {data ? data.lyrics : "[データ取得に失敗しました]"}
      </Typography>
    </Stack>
  );
}
