"use client";
import TagSelector from "@/app/_components/TagSelector";
import FilesWorkCreator from "@/app/create/components/FilesWorkCreator";
import LyricsWorkCreator from "@/app/create/components/LyricsWorkCreator";
import TextWorkCreator from "@/app/create/components/TextWorkCreator";
import WorkSelector from "@/app/create/components/WorkSelector";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  FilesWork,
  LyricsWork,
  TextWork,
  CreatingWork,
} from "@/app/create/type";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { createWork, finishWorkFileCreating } from "@/app/_lib/actions/work";
import { createTag } from "@/app/_lib/actions/tag";
import AuthorSelector, { Author } from "@/app/_components/AuthorSelector";
import { useSnackbar } from "@/app/_lib/application/snackbar/snackbar";
import Link from "@/app/_components/Link";
import { WorkType } from "@/app/_lib/common-types/work";
import { Tag } from "@/app/_lib/common-types/tag";
import { arbitrarilyMimeType } from "@/app/_lib/util/arbitrarily-mimetype";
import {
  keyGenerator,
  useChangeFileUploadQueue,
} from "@/app/_lib/jotai/file-upload";

interface FormInputs {
  title: string;
  description: string;
  authors: Author[];
  tags: Tag[];
  workType: WorkType;
  fileWork?: Omit<FilesWork, keyof CreatingWork>;
  textWork?: Omit<TextWork, keyof CreatingWork>;
  lyricsWork?: Omit<LyricsWork, keyof CreatingWork>;
}

export default function Creator({ defaultAuthor }: { defaultAuthor: Author }) {
  const theme = useTheme();
  const { addSnackbar } = useSnackbar();
  const { addQueue, updateQueue, deleteFromQueue } = useChangeFileUploadQueue();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    reset,
  } = useForm<FormInputs>({ defaultValues: { workType: WorkType.FILES } });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    function alertBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    window.addEventListener("beforeunload", alertBeforeUnload);
    createWork({
      title: data.title,
      description: data.description,
      authors: data.authors,
      tags: data.tags?.map((tagData) => tagData.id),
      workType: data.workType,
      textWork: workType === WorkType.TEXT ? data.textWork : undefined,
      lyricsWork: workType === WorkType.LYRICS ? data.lyricsWork : undefined,
    }).then(async (value) => {
      if (!value) return;
      if (data.fileWork) {
        data.fileWork.files.forEach((fileInfo) => {
          const queueId = keyGenerator("create", value.id, fileInfo.key);
          addQueue({
            workName: data.title,
            key: queueId,
            fileName: fileInfo.displayName,
            type: "create",
          });
        });

        for (let i = 0; i < data.fileWork.files.length; i++) {
          const fileInfo = data.fileWork.files[i];

          const queueId = keyGenerator("create", value.id, fileInfo.key);

          const params = new URLSearchParams();
          params.append("i", i.toString());

          const formData = new FormData();
          formData.append("file", fileInfo.file);
          formData.append("display-name", fileInfo.displayName);
          formData.append("mime-type", arbitrarilyMimeType(fileInfo.file));

          const xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", (e) => {
            const progress = (e.loaded / e.total) * 100;
            updateQueue(queueId, { percent: progress });
          });
          xhr.open(
            "POST",
            `/api/work/${value.id}/file-upload?${params.toString()}`
          );
          xhr.send(formData);
          await new Promise((resolve, reject) => {
            xhr.addEventListener("load", resolve);
            xhr.addEventListener("error", reject);
          });
          deleteFromQueue(queueId);
        }
      }
      if (data.workType === WorkType.FILES)
        await finishWorkFileCreating(value.id);
      const link = ({ close }: { close: () => void }) => (
        <Link linkProps={{ href: `/work/${value?.id}` }} onClick={close}>
          見る
        </Link>
      );
      addSnackbar({
        key: crypto.randomUUID(),
        message: `作品「${data.title}」の作成が完了しました`,
        action: link,
      });
      window.removeEventListener("beforeunload", alertBeforeUnload);
    });
    reset();
  };

  const workType = watch("workType");
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Typography
          variant="h2"
          sx={{
            fontSize: "1.5em",
            [theme.breakpoints.up("sm")]: {},
          }}
        >
          作品の作成
        </Typography>
        <TextField
          label="タイトル"
          fullWidth
          {...register("title", {
            required: { message: "タイトルは必須です", value: true },
            maxLength: {
              message: "タイトル名は127文字以下にしてください",
              value: 127,
            },
          })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <Controller
          control={control}
          name="authors"
          defaultValue={[defaultAuthor]}
          render={({ field, formState: { errors } }) => (
            <AuthorSelector
              value={field.value}
              onChange={(tags) => field.onChange(tags)}
              onBlur={field.onBlur}
              error={!!errors.authors}
              helperText={errors.authors?.message}
            />
          )}
          rules={{
            validate: (value) => {
              if (!value) return false;
              if (value.length <= 0)
                return "最低でも一人は作者を指定してください";
              return true;
            },
          }}
        />
        <TextField
          label="説明欄"
          multiline
          rows={5}
          {...register("description", {
            maxLength: {
              message: "説明欄に入力できるのは2047文字までです",
              value: 2047,
            },
          })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <Controller
          control={control}
          defaultValue={[]}
          name="tags"
          render={({ field }) => (
            <TagSelector
              value={field.value}
              onChange={(tags) => field.onChange(tags)}
              onBlur={field.onBlur}
              onCreateTag={async (tagName) => {
                const newTag = await createTag(tagName);
                field.onChange([...field.value, newTag]);
              }}
            />
          )}
        />
        <Box>
          <Controller
            render={({ field }) => (
              <WorkSelector
                selectedWorkType={field.value}
                onChangeWorkType={(type) => field.onChange(type)}
              />
            )}
            control={control}
            name="workType"
          />
          <Paper
            variant="outlined"
            sx={{
              borderRadius: `0 0 1em 1em`,
              p: 2,
            }}
          >
            <Box hidden={workType !== WorkType.FILES}>
              <Controller
                defaultValue={{ files: [] }}
                name="fileWork"
                control={control}
                render={({ field }) => (
                  <FilesWorkCreator
                    value={field.value ?? { files: [] }}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                )}
                rules={{
                  validate: (value, inputs) => {
                    if (inputs.workType !== WorkType.FILES) return true;
                    if (!value) return "作品を追加してください";
                    if (value.files.length === 0)
                      return "作品を追加してください";
                    if (
                      !value.files.every((file) => file.displayName.length > 0)
                    )
                      return "ファイルの表示名を指定してください";
                    return true;
                  },
                }}
              />
            </Box>
            <Box hidden={workType !== WorkType.TEXT}>
              <Controller
                defaultValue={undefined}
                control={control}
                render={({ field }) => (
                  <TextWorkCreator onChange={field.onChange} />
                )}
                name="textWork"
                rules={{
                  validate: (value, inputs) => {
                    if (inputs.workType !== WorkType.TEXT) return true;
                    if (!value) return "文章を入力してください";
                    if (value.text === "") return "文章を入力してください";
                    return true;
                  },
                }}
              />
            </Box>
            <Box hidden={workType !== WorkType.LYRICS}>
              <Controller
                control={control}
                render={({ field }) => (
                  <LyricsWorkCreator
                    onChange={field.onChange}
                    value={field.value || { lyrics: "", originalSongName: "" }}
                  />
                )}
                name="lyricsWork"
                rules={{
                  validate: (value, inputs) => {
                    if (inputs.workType !== "Lyrics") return true;
                    if (!value?.lyrics) return "歌詞を書いてください";
                    if (!value.originalSongName) return "RESPECT AUTHORS";
                    return true;
                  },
                }}
              />
            </Box>
          </Paper>
          {workType === WorkType.FILES && !!errors.fileWork && (
            <Typography sx={{ color: "red" }}>
              {errors.fileWork.message}
            </Typography>
          )}
          {workType === WorkType.TEXT && !!errors.textWork && (
            <Typography sx={{ color: "red" }}>
              {errors.textWork.message}
            </Typography>
          )}
          {workType === WorkType.LYRICS && !!errors.lyricsWork && (
            <Typography sx={{ color: "red" }}>
              {errors.lyricsWork.message}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
        >
          作成
        </Button>
        {isSubmitting && <LinearProgress />}
      </Stack>
    </form>
  );
}
