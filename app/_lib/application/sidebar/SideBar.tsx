"use client";
import {
  Create,
  Home,
  FormatListBulleted as FormatListBulletedIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  LinearProgress,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import SidebarItem from "@/app/_lib/application/sidebar/SideBarItem";
import { useAtom } from "jotai";
import { isOpenSidebarAtom } from "../jotai/sidebar";
import UploadStatusNavigation from "./UploadStatusNavigation";

export default function Sidebar() {
  const [isOpenSidebar, setIsOpenSidebar] = useAtom(isOpenSidebarAtom);
  function handleClose() {
    setIsOpenSidebar(false);
  }
  return (
    <Drawer anchor="left" open={isOpenSidebar} onClose={handleClose}>
      <Box sx={{ width: 240, py: 2 }}>
        <Stack spacing={1}>
          <SidebarItem onClick={handleClose} href={"/"}>
            <Home sx={{ verticalAlign: "-5px" }} /> ホーム
          </SidebarItem>
          <SidebarItem onClick={handleClose} href={"/create"}>
            <Create sx={{ verticalAlign: "-5px" }} /> 作成
          </SidebarItem>
          <SidebarItem onClick={handleClose} href={"/all-works"}>
            <FormatListBulletedIcon sx={{ verticalAlign: "-7px", mr: 1 }} />
            すべての作品
          </SidebarItem>
          <SidebarItem onClick={handleClose} href={"/upload-status"}>
            <UploadStatusNavigation />
          </SidebarItem>
        </Stack>
      </Box>
    </Drawer>
  );
}
