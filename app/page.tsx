import WorksViewer from "@/app/_components/home/WorksViewer";
import { Metadata } from "next";
import Section from "./_components/Section";
import SystemFileInfo from "./_components/home/SystemFileInfo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ホーム",
};

export default async function Page() {
  return (
    <>
      <Section>
        <WorksViewer />
      </Section>
      <SystemFileInfo />
    </>
  );
}
