"use client";
import { Close, Logout } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { isOpenAccountMenuModalAtom } from "../jotai/account-menu";

export default function AcccountMenu() {
  const [isOpen, setIsShow] = useAtom(isOpenAccountMenuModalAtom);

  function onClose() {
    setIsShow(false);
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        onClick={onClose}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{ width: 300, p: 3, position: "relative" }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            sx={{ position: "absolute", top: 4, right: 4 }}
            onClick={onClose}
          >
            <Close />
          </IconButton>
          <Stack
            spacing={2}
            sx={{
              my: 2,
              flexGrow: 1,
            }}
          >
            <Button sx={{ width: "100%", p: 1 }} disabled>
              Coming soon...
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Modal>
  );
}
