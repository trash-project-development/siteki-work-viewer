"use client";
import Link from "./Link";
import { Avatar, Chip, Typography } from "@mui/material";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { X, YouTube } from "@mui/icons-material";
import { fetchWork } from "../_lib/fetchers/client/work";
import { FaDiscord } from "react-icons/fa";

export default function AutoLinker({ children = "" }: { children?: string }) {
  const [splittedText, setSplittedText] = useState<(JSX.Element | string)[]>([
    "読み込み中...",
  ]);
  useEffect(() => {
    (async () => {
      setSplittedText(await parseText(children));
    })();
  }, [children]);
  return (
    <Typography component="span">
      {splittedText.map((v, i) => (
        <Fragment key={i}>{v}</Fragment>
      ))}
    </Typography>
  );
}

async function parseText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  const retVal = [];
  for (const part of parts) {
    if (urlRegex.test(part)) {
      const url = new URL(part);
      if (url.host === window.location.host) {
        if (isWorkURL(url.pathname)) {
          const workId = url.pathname.replace("/work/", "");
          const workInfo = await fetchWork(workId);
          retVal.push(
            <Link linkProps={{ href: url }}>
              <Chip
                size="small"
                label={workInfo?.title}
                avatar={<Avatar src="/icon512_maskable.png" alt="Junk Web" />}
              />
            </Link>
          );
          continue;
        }
      }
      if (isYouTubeURL(part)) {
        const videoId = extractYouTubeVideoId(part);
        retVal.push(
          <Link linkProps={{ href: part }}>
            <Chip size="small" label={videoId} icon={<YouTube />} />
          </Link>
        );
        continue;
      }
      if (isTwitterURL(part)) {
        const tweetId = extractTwitterTweetId(part);
        retVal.push(
          <Link linkProps={{ href: part }}>
            <Chip size="small" label={tweetId} icon={<X />} />
          </Link>
        );
        continue;
      }
      if (url.host === "discord.com") {
        const [, type, guildId] = url.pathname.split("/");
        if (type === "channels") {
          if (guildId === process.env.NEXT_PUBLIC_GUILD_ID) {
            retVal.push(
              <Link linkProps={{ href: part }}>
                <Chip
                  size="small"
                  label={process.env.NEXT_PUBLIC_GUILD_NAME}
                  icon={<FaDiscord />}
                />
              </Link>
            );
          } else {
            retVal.push(
              <Link linkProps={{ href: part }}>
                <Chip
                  size="small"
                  label="(不明なサーバー)"
                  icon={<FaDiscord />}
                />
              </Link>
            );
          }
          continue;
        }
      }
      retVal.push(
        <Link
          linkProps={{ href: part }}
          rel="noopener noreferrer"
          target="_blank"
          sxProps={{ display: "inline" }}
        >
          {part}
        </Link>
      );
      continue;
    }
    retVal.push(part);
    continue;
  }
  return retVal;
}

function isYouTubeURL(url: string) {
  const youtubeUrlPattern =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/.*\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"\&?\/\s]{11})/;
  return youtubeUrlPattern.test(url);
}

function extractYouTubeVideoId(url: string) {
  const youtubeUrlPattern =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/.*\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"\&?\/\s]{11})/;
  const match = url.match(youtubeUrlPattern);
  return match ? match[1] : null;
}

function isTwitterURL(url: string) {
  const twitterUrlPattern =
    /(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/(?:#!\/)?(?:[a-zA-Z0-9_]+)\/status\/(\d+)/;
  return twitterUrlPattern.test(url);
}

function extractTwitterTweetId(url: string) {
  const twitterUrlPattern =
    /(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/(?:#!\/)?(?:[a-zA-Z0-9_]+)\/status\/(\d+)/;
  const match = url.match(twitterUrlPattern);
  return match ? match[1] : null;
}

function isWorkURL(pathname: string) {
  const regexp = /^\/work\/[^/]+\/?$/g;
  return regexp.test(pathname);
}
