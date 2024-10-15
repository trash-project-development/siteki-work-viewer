export function escapeTagName(tag: string) {
  return tag.replaceAll(/[^a-zA-Z0-9ａ-ｚＡ-Ｚァ-ヶｦ-ﾟ０-９ー-龠ぁ-ゔ〇?？!！\(\)\.]/g, "-");
}
