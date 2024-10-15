import { Box, Stack, Typography } from "@mui/material";
import Link from "./_components/Link";

export default async function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        width: "100%",
      }}
    >
      <Stack direction="column" spacing={2} alignItems="center">
        <Typography variant="h2" sx={{ fontSize: "2em" }}>
          404 | Not Found
        </Typography>
        <Typography sx={{ textAlign: "center", textWrap: "balance" }}>
          お探しのページが見つかりませんでした。削除されたか、URLが変更された可能性があります。
          <Link linkProps={{ href: "/" }}>ホーム</Link>
          に戻るか、他のページをお試しください。
        </Typography>
      </Stack>
    </Box>
  );
}
