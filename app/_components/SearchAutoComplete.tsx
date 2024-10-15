"use client";
import { Tag } from "@/app/_lib/common-types/tag";
import { User } from "@/app/_lib/common-types/user";
import { Autocomplete, SxProps, TextField, Theme } from "@mui/material";
import { useState, useEffect } from "react";

export default function SearchAutoComplete({
  value,
  onChange,
  onSearch,
  size = "medium",
  sxOverrides,
}: {
  value: string;
  onChange: (e: string) => void;
  onSearch?: () => void;
  size?: "small" | "medium";
  sxOverrides?: SxProps<Theme>;
}) {
  const [options, setOptions] = useState<string[]>([]);

  // `author:`または`tag:`に基づいてAPIを呼び出す関数
  const fetchUser = async (searchText: string) => {
    try {
      const response = await fetch(`/api/user`);
      const json: User[] = await response.json();
      const authorMatches = value.match(/author:([^\s]+)/g);
      const alreadyAuthors = authorMatches?.map(
        (author) => author.split(":")[1]
      );

      const inputFiltered =
        searchText === ""
          ? json
          : json.filter((v) => v.name.startsWith(searchText));

      const duplicatedFitlered = inputFiltered.filter((author) =>
        alreadyAuthors
          ? !alreadyAuthors.some(
              (alreadyAuthor) => alreadyAuthor === author.name
            )
          : true
      );
      setOptions(duplicatedFitlered.map((v) => v.name));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTag = async (searchText: string) => {
    try {
      const response = await fetch(`/api/tag`);
      const json: Tag[] = await response.json();
      const tagMatches = value.match(/tag:([^\s]+)/g);
      const alreadyTags = tagMatches?.map((tag) => tag.split(":")[1]);
      const inputFiltered =
        searchText === ""
          ? json
          : json.filter((v) => v.name.startsWith(searchText));
      const duplicateFiltered = inputFiltered.filter((tag) =>
        alreadyTags
          ? !alreadyTags.some((alreadyTag) => alreadyTag === tag.name)
          : true
      );
      setOptions(duplicateFiltered.map((v) => v.name));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 入力変更時の処理
  useEffect(() => {
    const authorMatch = value.match(/author:([^\s]*)$/);
    const tagMatch = value.match(/tag:([^\s]*)$/);

    if (authorMatch) {
      // `author:` で始まっているときは `/api/user` からデータを取得
      fetchUser(authorMatch[1]);
    } else if (tagMatch) {
      // `tag:` で始まっているときは `/api/tag` からデータを取得
      fetchTag(tagMatch[1]);
    } else {
      setOptions([]); // その他のケースではオプションをクリア
    }
  }, [value]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      // No Filter
      filterOptions={(v) => v}
      onChange={(e, newValue, reason) => {
        if (reason === "selectOption") {
          const queryWithout = value
            .replace(/author:[^\s]*$/, "author:") // author: に続く文字列を削除
            .replace(/tag:[^\s]*$/, "tag:");
          onChange && onChange(queryWithout + newValue);
        }
        if (reason === "createOption") {
          // めっちゃ名前とあってないけどオプションに何もない状態でEnterを押すと発火するので
          onSearch && onSearch();
          setOptions([]);
        }
      }}
      inputValue={value}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "selectOption" || reason === "reset") return;
        onChange && onChange(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search" variant="outlined" />
      )}
      size={size}
      sx={{ flex: 1, ...sxOverrides }}
    />
  );
}
