import { Metadata } from "next";
import UploadStatus from "./_components/UploadStatus";

export const metadata: Metadata = {
  title: "アップロードの進行状況",
};

export default function UploadStatusPage() {
  return <UploadStatus />;
}
