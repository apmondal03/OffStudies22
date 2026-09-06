"use server";

import { searchDictionaryIndex } from "@/lib/dictionary/dictionaryIndex";

export async function searchFullDictionary(query: string, limit = 8): Promise<string[]> {
  return searchDictionaryIndex(query, limit);
}
