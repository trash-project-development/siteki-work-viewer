import NextLink, { LinkProps } from "next/link";
import { Link as MuiLink, SxProps, Theme } from "@mui/material";

import React, { ReactNode } from "react";

type Props = {
  linkProps: LinkProps;
  sxProps?: SxProps<Theme>;
  children?: ReactNode;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const Link: React.FC<Props> = ({
  linkProps,
  sxProps,
  children,
  target,
  rel,
  onClick,
}) => {
  return (
    <NextLink href={linkProps.href} passHref legacyBehavior>
      <MuiLink
        sx={sxProps}
        underline="none"
        target={target}
        rel={rel}
        onClick={onClick}
      >
        {children}
      </MuiLink>
    </NextLink>
  );
};

export default Link;
