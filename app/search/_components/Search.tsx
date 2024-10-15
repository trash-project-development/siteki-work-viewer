"use client";

import AppSection from "@/app/_components/Section";
import { search } from "@/app/_lib/actions/search";
import { Work, WorkType } from "@/app/_lib/common-types/work";
import {
  ArrowDownward,
  ArrowUpward,
  CurrencyYen,
  Google,
  HelpOutline as HelpIcon,
  Search as SearchIcon,
  TextRotationAngleup,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "@/app/_components/Link";
import SearchAutoComplete from "@/app/_components/SearchAutoComplete";
import { Tag } from "@/app/_lib/common-types/tag";

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const defaultQuery = decodeURIComponent(params.get("q") ?? "");

  const [rawQuery, setRawQuery] = useState(defaultQuery);

  const [works, setWorks] = useState<Work[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagQuery, setTagQuery] = useState<Tag[]>([]);

  const [sortKey, setSortKey] = useState<keyof Work>("title");
  const [isAscending, setIsAscending] = useState(true);

  const workTypes = [WorkType.FILES, WorkType.TEXT, WorkType.LYRICS];

  function onSearchButtonClicked() {
    router.push(`${pathname}?q=${encodeURIComponent(rawQuery)}`);
    if (rawQuery === "") return;
    onSearch();
  }

  async function onSearch() {
    const searchedWorks = await search(rawQuery);
    setWorks(searchedWorks);

    const url = new URL(
      "/api/tag",
      `${window.location.protocol}//${window.location.host}`
    );
    const queryTerms = rawQuery.split(" ");

    const foundTags: Tag[] = [];
    for (const term of queryTerms) {
      if (term) {
        url.searchParams.set("q", term);
        const fetchedTags: Tag[] = await (await fetch(url)).json();
        foundTags.push(...fetchedTags);
      }
    }
    setTags(foundTags);

    const tagQueries = rawQuery.match(/tag:([^\s]+)/g);
    if (tagQueries) {
      const matchedTags: Tag[] = [];
      for (const tagQuery of tagQueries) {
        const tagName = tagQuery.replace("tag:", "");
        url.searchParams.set("q", tagName);
        const fetchedTags: Tag[] = await (await fetch(url)).json();

        const matchingTags = fetchedTags.filter((tag) => tag.name === tagName);
        matchedTags.push(...matchingTags);
      }
      setTagQuery(matchedTags);
    } else {
      setTagQuery([]);
    }
  }

  useEffect(() => {
    if (defaultQuery !== "") onSearch();
    setRawQuery(defaultQuery);
  }, [params]);

  const sortWorks = (key: keyof Work) => {
    const sorted = [...works].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return isAscending
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        return isAscending ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });

    setWorks(sorted);
  };

  const handleSort = (key: keyof Work) => {
    if (sortKey === key) {
      setIsAscending(!isAscending);
    } else {
      setSortKey(key);
      setIsAscending(true);
    }
    sortWorks(key);
  };

  return (
    <AppSection>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h2" fontSize="2em">
            検索
          </Typography>
          <Tooltip title="すべての検索はAND検索で行われます。「author:」を先頭にいれて検索することで作者を条件に入れて検索することができ、「tags:」を先頭にいれることでタグも検索できます。">
            <HelpIcon sx={{ color: "gray" }} />
          </Tooltip>
        </Stack>

        <Stack spacing={1} direction="row">
          <SearchAutoComplete
            value={rawQuery}
            onChange={(e) => setRawQuery(e)}
            onSearch={onSearchButtonClicked}
          />
          <Button
            startIcon={<SearchIcon />}
            variant="contained"
            onClick={onSearchButtonClicked}
          >
            検索
          </Button>
        </Stack>

        <ButtonGroup variant="contained" fullWidth>
          <Button
            endIcon={
              sortKey === "title" ? (
                isAscending ? (
                  <ArrowDownward />
                ) : (
                  <ArrowUpward />
                )
              ) : (
                ""
              )
            }
            onClick={() => handleSort("title")}
          >
            名前
          </Button>
          <Button
            endIcon={
              sortKey === "createdAt" ? (
                isAscending ? (
                  <ArrowDownward />
                ) : (
                  <ArrowUpward />
                )
              ) : (
                ""
              )
            }
            onClick={() => handleSort("createdAt")}
          >
            作成日時
          </Button>
        </ButtonGroup>
        {tagQuery.map((value) => (
          <Alert key={value.id} severity="info" variant="outlined">
            タグ「
            <Link linkProps={{ href: `/tag/${value.id}` }}>{value.name}</Link>
            」のページがあります
          </Alert>
        ))}

        {tags.length !== 0 && (
          <>
            <Typography variant="h3" fontSize="1.5em">
              タグ（{tags.length} 件）
            </Typography>

            <Box sx={{ display: "inline-block" }}>
              {tags.map((value) => (
                <Link key={value.id} linkProps={{ href: `/tag/${value.id}` }}>
                  <Chip label={value.name} sx={{ marginRight: 1 }} />
                </Link>
              ))}
            </Box>
          </>
        )}

        {works.length !== 0 && (
          <>
            <Typography variant="h3" fontSize="1.5em">
              作品（{works.length} 件）
            </Typography>

            {workTypes.map((type) => {
              const filteredWorks = works.filter((work) => work.type === type);
              if (filteredWorks.length === 0) return null;

              return (
                <Box key={type}>
                  <Typography variant="h3" fontSize="1.2em">
                    {type} 作品
                  </Typography>
                  <ul>
                    {filteredWorks.map((value) => (
                      <li key={value.id}>
                        <Link linkProps={{ href: `/work/${value.id}` }}>
                          {value.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Box>
              );
            })}
          </>
        )}

        {defaultQuery !== "" && works.length === 0 && (
          <Typography width="100%" textAlign="center">
            作品が見つかりませんでした
          </Typography>
        )}
      </Stack>
    </AppSection>
  );
}
