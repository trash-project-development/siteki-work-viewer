import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

export type UploadType = "edit" | "create";

export interface FileUploadStatus {
  key: string;
  workName: string;
  fileName: string;
  type: UploadType;
  percent: number;
}

const fileUploadQueueAtom = atom<FileUploadStatus[]>([]);

export function useChangeFileUploadQueue() {
  const setQueue = useSetAtom(fileUploadQueueAtom);
  function addQueue(data: Omit<FileUploadStatus, "percent">) {
    setQueue((prev) => [...prev, { ...data, percent: 0 }]);
  }
  function updateQueue(
    id: string,
    data: Partial<Omit<FileUploadStatus, "key">>
  ) {
    setQueue((prev) => {
      const mappedArray = prev.map((value) => {
        if (value.key !== id) return value;
        return {
          ...value,
          ...data,
        };
      });
      return mappedArray;
    });
  }
  function deleteFromQueue(id: string) {
    setQueue((prev) => {
      return prev.filter((value) => value.key !== id);
    });
  }
  return { addQueue, updateQueue, deleteFromQueue };
}

export function useFileUploadQueueValue() {
  const queue = useAtomValue(fileUploadQueueAtom);
  return queue;
}

export function keyGenerator(
  type: UploadType,
  workId: string,
  fileKey: string
) {
  return `${type}-${workId}-${fileKey}`;
}
