import { KidsWordsPlayer } from "@/components/kids/KidsWordsPlayer";

export default async function KidsWordsSpecificWordPage({
  params,
}: {
  params: Promise<{ category: string; word: string }>;
}) {
  const { category, word } = await params;
  return <KidsWordsPlayer category={category} startWord={word} />;
}
