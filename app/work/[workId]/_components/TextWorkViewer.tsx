import TextWorkDisplay from "@/app/_components/TextWorkDisplay";
import { APIText } from "@/app/api/work/type";
import { FormControlLabel, Switch, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function TextWorkViewer({ workId }: { workId: string }) {
  const { isLoading, data } = useQuery({
    queryKey: ["work", "text", "workId"],
    queryFn: async () => {
      const response = await fetch(`/api/work/${workId}/text/`);
      const json = await response.json();
      return json as APIText;
    },
  });

  const [localVertical, setLocalVertical] = useState<boolean>(
    data?.isTopToBottom ?? false
  );

  if (isLoading) return <Typography>読み込み中です...</Typography>;
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            value={localVertical}
            onChange={(_, checked) => setLocalVertical(checked)}
          />
        }
        label="縦書きで読む"
      />
      <TextWorkDisplay
        isVertical={localVertical}
        sxOverride={{ height: localVertical ? "30em" : "auto" }}
      >
        {data?.text}
      </TextWorkDisplay>
    </>
  );
}
