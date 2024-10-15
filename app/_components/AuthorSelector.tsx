import { Box, Autocomplete, TextField, Chip, Avatar } from "@mui/material";
import { error } from "console";
import { useCallback, useEffect, useState } from "react";

export interface Author {
  name: string;
  id: string;
  image: string;
}

interface PropsType {
  value?: Author[];
  onChange?: (tags: Author[]) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
}

export default function AuthorSelector({
  onChange,
  value,
  onBlur,
  error = false,
  helperText,
}: PropsType) {
  const [options, setOptions] = useState<Author[]>([]);
  const [inputValue, setInputValue] = useState("");

  const fetchAuthors = async () => {
    const authors: Author[] = await (
      await fetch(`/api/user?q=${inputValue}`)
    ).json();
    setOptions(
      authors.filter(
        (author) =>
          !value?.find((selectedAuthor) => selectedAuthor.id === author.id)
      )
    );
  };

  useEffect(() => {
    fetchAuthors();
  }, [inputValue, value]);

  // サジェストが表示
  const isEmpty = inputValue === "";
  const isIncludeSame = options.some((option) => option.name === inputValue);

  return (
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
          if (typeof lastElement !== "string" || (!isEmpty && isIncludeSame)) {
            const sameAuthor = options.find(
              (option) => option.name === inputValue
            );
            // HACK: sameAuthorでstringかどうか確定するがコンパイラは認知できないため
            if (sameAuthor) {
              onChange([
                ...(currentValue.slice(0, -1) as Author[]),
                sameAuthor,
              ]);
            } else {
              onChange(currentValue as Author[]);
            }
          }
        }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...otherProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                label={option.name}
                {...otherProps}
                avatar={<Avatar alt={option.name} src={option.image} />}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            helperText={helperText}
            variant="outlined"
            label="作者"
          />
        )}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          } else {
            return option.name;
          }
        }}
        noOptionsText="ユーザーが存在しません"
      />
    </Box>
  );
}
