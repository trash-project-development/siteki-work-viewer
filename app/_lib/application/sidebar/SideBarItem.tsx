import Link from "@/app/_components/Link";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function SidebarItem({
  children,
  href,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isSamePath = pathname === href;
  return href ? (
    <Link
      onClick={onClick}
      linkProps={{ href }}
      sxProps={{
        width: "100%",
        p: 2,
        color: "text.primary",
        textAlign: "center",
        ":hover": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        },
        pointerEvents: isSamePath ? "none" : "initial",
        backgroundColor: isSamePath ? "rgba(0, 0, 0, 0.2)" : "initial",
      }}
    >
      {children}
    </Link>
  ) : (
    <Box
      onClick={onClick}
      sx={{
        width: "100%",
        p: 2,
        color: "text.primary",
        textAlign: "center",
      }}
    >
      {children}
    </Box>
  );
}
