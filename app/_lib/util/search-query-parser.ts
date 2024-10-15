interface ParsedQuery {
  queryString: string[];
  tag: string[];
  author: string[];
}

export function searchQueryParser(query: string): ParsedQuery {
  const result: ParsedQuery = {
    queryString: [],
    tag: [],
    author: [],
  };

  // 半角スペースと全角スペースでクエリを分割
  const parts = query.split(/[\s\u3000]+/);

  parts.forEach((part) => {
    if (part.startsWith("tag:")) {
      // tag: の部分を取り除いてタグを追加
      result.tag.push(part.slice(4));
    } else if (part.startsWith("author:")) {
      // author: の部分を取り除いて著者を追加
      result.author.push(part.slice(7));
    } else {
      // それ以外はクエリ文字列として追加
      result.queryString.push(part);
    }
  });

  return result;
}
