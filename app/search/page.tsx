import { Metadata } from "next";
import Search from "./_components/Search";

export const metadata: Metadata = {
  title: "検索",
};

export default function SearchPage() {
  return <Search />;
}
