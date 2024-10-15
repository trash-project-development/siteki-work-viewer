/**
 * データベースの時刻を+9に合わせる
 * @param date
 * @returns
 */
export function convertDBDateIntoCurrentUnix(date: Date) {
  const copied = new Date(date.valueOf());
  return copied.getTime();
}
