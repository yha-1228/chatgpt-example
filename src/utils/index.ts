import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: (string | boolean | undefined)[]) {
  return twMerge(inputs.filter(Boolean).join(" "));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createId(mock?: string) {
  return mock || uuidv4();
}

export function uniq<T>(array: T[]) {
  return [...new Set(array)];
}

/**
 * オブジェクトの配列の中から、一意であるべきキーを持つ要素が重複している場合
 * 重複した要素を最後のものだけ残す。
 */
export function removeDuplicate<T>(records: T[], idName: keyof T) {
  const ids = uniq(records.map((record) => record[idName]));

  const result = ids.map((id) => {
    const recordsFindById = records.filter((record) => record[idName] === id);
    return recordsFindById.length === 0
      ? recordsFindById[0]
      : recordsFindById[recordsFindById.length - 1];
  });

  return result;
}
