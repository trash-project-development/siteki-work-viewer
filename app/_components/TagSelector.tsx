"use client";
import {
  Box,
  Autocomplete,
  TextField,
  Button,
  Typography,
  Chip,
} from "@mui/material";
import { escapeTagName } from "../_lib/util/escape-tagname";
import { useEffect, useState } from "react";
import TagCreateModal from "./TagCreateModal";
import { Tag } from "../_lib/common-types/tag";

interface PropsType {
  value?: Tag[];
  onChange?: (tags: Tag[]) => void;
  onBlur?: () => void;
  disableCreate?: boolean;
  onCreateTag?: (tagName: string) => Promise<void> | void;
  error?: boolean;
  helperText?: string;
}

export default function TagSelector({
  onChange,
  value,
  onBlur,
  disableCreate = false,
  onCreateTag,
  error = false,
  helperText,
}: PropsType) {
  const [options, setOptions] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpenCreateTagModal, setIsOpenCreateTagModal] = useState(false);
  const [creatingTagName, setCreatingTagName] = useState("");

  const fetchTags = async () => {
    const url = new URL(
      "/api/tag",
      `${window.location.protocol}//${window.location.host}`
    );
    if (inputValue) {
      url.searchParams.append("q", inputValue);
    }
    const unselectedTags: Tag[] = await (await fetch(url)).json();
    setOptions(
      unselectedTags.filter(
        (unselectedTag) =>
          !value?.find((selectedTag) => selectedTag.id === unselectedTag.id)
      )
    );
  };

  useEffect(() => {
    // TODO debounceとか使って負荷軽減する
    fetchTags();
  }, [inputValue, value]);

  // サジェストが表示
  const isEmpty = inputValue === "";
  const isIncludeSameInOptions = options?.some(
    (option) => option.name === inputValue
  );

  const isAlreadyHaveSameTag = value?.some(
    (selectedTag) => selectedTag.name === inputValue
  );

  function handleCreateTag(tagName: string) {
    setInputValue("");
    if (!disableCreate) {
      setCreatingTagName(tagName);
      setIsOpenCreateTagModal(true);
    }
  }

  return (
    <>
      <Box>
        <Autocomplete
          freeSolo
          multiple
          onBlur={onBlur}
          options={options}
          value={value || []}
          onChange={(_, currentValue) => {
            // currentValueにはEnterを押した際の値が入っている
            // 例: [Tag, Tag, Tag, string | Tag]
            if (!onChange) return;

            const lastElement = [...currentValue].pop();
            if (
              typeof lastElement !== "string" ||
              (!isEmpty && isIncludeSameInOptions)
            ) {
              const sameTag = options.find(
                (option) => option.name === inputValue
              );
              // HACK: sameTagでstringかどうか確定するがコンパイラは認知できないため
              if (sameTag) {
                onChange([...(currentValue.slice(0, -1) as Tag[]), sameTag]);
              } else {
                onChange(currentValue as Tag[]);
              }
            } else {
              handleCreateTag(lastElement);
            }
          }}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...otherProps } = getTagProps({ index });
              return <Chip key={key} label={option.name} {...otherProps} />;
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              error={error}
              helperText={helperText}
              variant="outlined"
              label="タグ"
            />
          )}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            } else {
              return option.name;
            }
          }}
          noOptionsText={`タグが存在しません。${
            disableCreate
              ? "タグが存在するか確かめてください"
              : "Enterキーを押すか、作成ボタンを押して作成します"
          }`}
        />
        {!disableCreate &&
          !isEmpty &&
          !isAlreadyHaveSameTag &&
          !isIncludeSameInOptions && (
            <Button
              sx={{
                textTransform: "none",
                textWrap: "nowrap",
              }}
              fullWidth
              onClick={() => handleCreateTag(inputValue)}
            >
              タグ「
              <Typography
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {escapeTagName(inputValue)}
              </Typography>
              」を新規作成する
            </Button>
          )}
      </Box>
      <TagCreateModal
        open={isOpenCreateTagModal}
        onCreate={async (tagName) => {
          if (onCreateTag) {
            await onCreateTag(tagName);
            fetchTags();
          }
        }}
        onClose={async () => {
          setIsOpenCreateTagModal(false);
          await new Promise((resolve) => setTimeout(resolve, 100));
          setCreatingTagName("");
        }}
        tagName={creatingTagName}
      />
    </>
  );
}
