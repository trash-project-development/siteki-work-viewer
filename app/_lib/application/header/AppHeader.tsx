"use client";
import { useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Skeleton,
  Stack,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Menu, Search } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import { isOpenSidebarAtom } from "../jotai/sidebar";
import Link from "@/app/_components/Link";
import { isOpenAccountMenuModalAtom } from "../jotai/account-menu";
import { useFileUploadQueueValue } from "../../jotai/file-upload";
import SearchAutoComplete from "@/app/_components/SearchAutoComplete";
import { usePathname, useRouter } from "next/navigation";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isSmartphone = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const setIsOpenAccountMenu = useSetAtom(isOpenAccountMenuModalAtom);
  const setIsOpenSidebar = useSetAtom(isOpenSidebarAtom);
  const uploadQueue = useFileUploadQueueValue();
  const isBadgeActive = uploadQueue.length !== 0;

  function onSearch() {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  }

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsOpenSidebar((prev) => !prev)}
          >
            <Badge variant="dot" color="secondary" invisible={!isBadgeActive}>
              <Menu />
            </Badge>
          </IconButton>
          <Typography
            variant="h1"
            sx={(theme: Theme) => ({
              textWrap: "nowrap",
              mx: 2,
              fontSize: "1.2em",
              [theme.breakpoints.up("sm")]: {
                fontSize: "2em",
              },
            })}
          >
            <Link linkProps={{ href: "/" }} sxProps={{ color: "text.primary" }}>
              {process.env.NEXT_PUBLIC_APP_NAME}
            </Link>
          </Typography>
          <Box
            sx={{
              height: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              flexGrow: 1,
              mx: 0,
            }}
          >
            <Stack direction="row">
              <SearchAutoComplete
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e);
                }}
                size="small"
                sxOverrides={{
                  width: "10em",
                  display:
                    isSmartphone || pathname === "/search" ? "none" : "block",
                }}
                onSearch={onSearch}
              />

              <IconButton onClick={onSearch}>
                <Search />
              </IconButton>
            </Stack>
            <IconButton onClick={() => setIsOpenAccountMenu(true)}>
              <Avatar src={"/api/user/icon"} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
