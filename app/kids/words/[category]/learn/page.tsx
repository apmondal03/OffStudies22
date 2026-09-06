import { KidsWordsPlayer } from "@/components/kids/KidsWordsPlayer";

export default async function KidsWordsLearnAllPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <KidsWordsPlayer category={category} />;
}
