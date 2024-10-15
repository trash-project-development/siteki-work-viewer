import { Toolbar } from "@mui/material";
import AppHeader from "../_lib/application/header/AppHeader";
import Sidebar from "../_lib/application/sidebar/SideBar";
import AcccountMenu from "../_lib/application/account-menu/AccountMenu";

export default function AuthorizedAppbar() {
  return (
    <>
      <AppHeader />
      <AcccountMenu />
      <Sidebar />
      {/* ↓Offset */}
      <Toolbar />
    </>
  );
}
