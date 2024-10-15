import { Metadata } from "next";
import Creator from "./components/Creator";
import Section from "../_components/Section";

export const metadata: Metadata = {
  title: "作品作成",
};

export default async function Page() {
  // TODO: デフォルトユーザーを指定する
  return (
    <Section>
      <Creator
        defaultAuthor={{
          id: "",
          image: "/api/user/icon",
          name: "自分",
        }}
      />
    </Section>
  );
}
