"use client";
import AuthorSelector from "@/app/_components/AuthorSelector";
import TagSelector from "@/app/_components/TagSelector";
import {
  editLyricsWork,
  editTextWork,
  editWork,
  editAlreadyWorkFile,
  endEditWorkFiles,
  startEditWorkFiles,
} from "@/app/_lib/actions/work";
import { Tag } from "@/app/_lib/common-types/tag";
import { User } from "@/app/_lib/common-types/user";
import { WorkType } from "@/app/_lib/common-types/work";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import FileWorkEdit, { EditingFile } from "./FileWorkEdit";
import { createTag } from "@/app/_lib/actions/tag";
import { useSnackbar } from "@/app/_lib/application/snackbar/snackbar";
import TextWorkEdit from "./TextWorkEdit";
import LyricsWorkEdit, { EditingLyrics } from "./LyricsWorkEdit";
import {
  keyGenerator,
  useChangeFileUploadQueue,
} from "@/app/_lib/jotai/file-upload";
import { fetchWorkStatus } from "@/app/_lib/fetchers/client/work";
import { useQuery } from "@tanstack/react-query";
import AppSection from "@/app/_components/Section";

interface DefaultWorkInfoValue {
  title: string;
  tags: Tag[];
  authors: User[];
  description?: string;
  files?: {
    id: string;
    displayName: string;
    fileName: string;
    mimeType: string;
  }[];
  textWork?: string;
  lyrics?: EditingLyrics;
}

interface Inputs {
  title: string;
  authors: User[];
  tags: Tag[];
  description?: string;
  files?: EditingFile[];
  textWork?: string;
  lyrics?: EditingLyrics;
}

export default function WorkEdit({
  defaultValues,
  workId,
  workType,
}: {
  defaultValues: DefaultWorkInfoValue;
  workId: string;
  workType: WorkType;
}) {
  const { addQueue, deleteFromQueue, updateQueue } = useChangeFileUploadQueue();
  const { addSnackbar } = useSnackbar();
  const router = useRouter();

  const { data: status } = useQuery({
    queryKey: ["work", workId, "status"],
    queryFn: async () => {
      return await fetchWorkStatus(workId);
    },
  });

  const {
    register,
    control,
    formState: { errors, isSubmitting, isDirty },
    handleSubmit,
  } = useForm<Inputs>({
    defaultValues: {
      ...defaultValues,
      files: defaultValues.files?.map((v) => ({
        file: v.id,
        displayName: v.displayName,
        fileName: v.fileName,
        mimeType: v.mimeType,
      })),
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await editWork(workId, {
      title: data.title,
      authors: data.authors,
      tags: data.tags,
      description: data.description,
    });
    if (workType === WorkType.FILES && data.files) {
      data.files.forEach((fileInfo, index) => {
        if (typeof fileInfo.file === "string") return;
        const queueId = keyGenerator("edit", workId, index.toString());
        addQueue({
          key: queueId,
          workName: data.title,
          fileName: fileInfo.displayName,
          type: "edit",
        });
      });
      await startEditWorkFiles(workId);
      for (let i = 0; i < data.files.length; i++) {
        const fileInfo = data.files[i];
        if (typeof fileInfo.file === "string") {
          await editAlreadyWorkFile(fileInfo.file, i, fileInfo.displayName);
        } else {
          const queueId = keyGenerator("edit", workId, i.toString());
          const params = new URLSearchParams();
          params.append("i", i.toString());

          const formData = new FormData();
          formData.append("file", fileInfo.file);
          formData.append("display-name", fileInfo.displayName);

          const xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", (e) => {
            const progress = (e.loaded / e.total) * 100;
            updateQueue(queueId, { percent: progress });
          });
          xhr.open(
            "POST",
            `/api/work/${workId}/file-upload?${params.toString()}`
          );
          xhr.send(formData);
          await new Promise((resolve, reject) => {
            xhr.addEventListener("load", resolve);
            xhr.addEventListener("error", reject);
          });

          deleteFromQueue(queueId);
        }
      }
      await endEditWorkFiles(workId);
    }
    if (workType === WorkType.TEXT && data.textWork) {
      await editTextWork(workId, { text: data.textWork });
    }
    if (workType === WorkType.LYRICS && data.lyrics) {
      await editLyricsWork(workId, data.lyrics);
    }
    addSnackbar({
      key: `edit-${workId}`,
      message: "編集が完了しました",
      severity: "info",
    });
    router.refresh();
  };

  return (
    <Container sx={{ p: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography
            variant="h2"
            sx={{
              fontSize: "2em",
            }}
          >
            作品編集
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
            render={({ field, fieldState }) => (
              <AuthorSelector
                value={field.value}
                onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
            rules={{
              validate: (value) => {
                if (value.length < 1) return "最低でも作者は1人必要です";
                return true;
              },
            }}
          />
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagSelector
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                onCreateTag={async (tagName) => {
                  const newTag = await createTag(tagName);
                  field.onChange([...field.value, newTag]);
                }}
              />
            )}
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
            disabled={workType !== WorkType.FILES}
            name="files"
            control={control}
            render={({ field, fieldState }) => (
              <FileWorkEdit
                hidden={workType !== WorkType.FILES}
                onChange={field.onChange}
                value={field.value}
                error={fieldState.error?.message}
              />
            )}
            rules={{
              validate: (value) => {
                if (!value) return false;
                if (value.length === 0) return "ファイルは１以上必要です";
                if (!value.every((file) => file.displayName.length > 0))
                  return "ファイルの表示名を指定してください";
                return true;
              },
            }}
          />
          <Controller
            disabled={workType !== WorkType.TEXT}
            control={control}
            name="textWork"
            render={({ field }) => (
              <TextWorkEdit
                hidden={workType !== WorkType.TEXT}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="lyrics"
            control={control}
            disabled={workType !== WorkType.LYRICS}
            render={({ field }) => (
              <LyricsWorkEdit
                hidden={workType !== WorkType.LYRICS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting || !isDirty || status === "processing"}
          >
            編集
          </Button>
          {status === "processing" && (
            <Typography color="red">
              ファイルは処理中のため編集できません
            </Typography>
          )}
        </Stack>
      </form>
    </Container>
  );
}
