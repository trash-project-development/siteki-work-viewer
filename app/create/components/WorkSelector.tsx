import { Tab, Tabs, Theme, useMediaQuery } from "@mui/material";
import { Add, EditNote, Lyrics } from "@mui/icons-material";
import { WorkType } from "@/app/_lib/common-types/work";

interface PropsType {
  selectedWorkType: WorkType;
  onChangeWorkType: (type: WorkType) => void;
}

export default function WorkSelector({
  selectedWorkType,
  onChangeWorkType,
}: PropsType) {
  const isPCSize = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  return (
    <Tabs
      variant="scrollable"
      value={selectedWorkType}
      onChange={(e, value) => onChangeWorkType(value)}
    >
      <Tab
        icon={<Add />}
        label="ファイル"
        value={WorkType.FILES}
        iconPosition={isPCSize ? "start" : "top"}
        sx={{
          ...(selectedWorkType === WorkType.FILES
            ? { bgcolor: "background.paper", borderRadius: "1em 1em 0 0" }
            : undefined),
        }}
      />
      <Tab
        icon={<EditNote />}
        label="文章"
        value={WorkType.TEXT}
        iconPosition={isPCSize ? "start" : "top"}
        sx={{
          ...(selectedWorkType === WorkType.TEXT
            ? { bgcolor: "background.paper", borderRadius: "1em 1em 0 0" }
            : undefined),
        }}
      />
      <Tab
        icon={<Lyrics />}
        label="歌詞"
        value={WorkType.LYRICS}
        iconPosition={isPCSize ? "start" : "top"}
        sx={{
          ...(selectedWorkType === WorkType.LYRICS
            ? { bgcolor: "background.paper", borderRadius: "1em 1em 0 0" }
            : undefined),
        }}
      />
    </Tabs>
  );
}
