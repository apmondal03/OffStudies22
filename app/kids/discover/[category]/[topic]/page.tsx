import { KidsDiscoveryPlayer } from "@/components/kids/KidsDiscoveryPlayer";

export default async function KidsDiscoverSpecificTopicPage({
  params,
}: {
  params: Promise<{ category: string; topic: string }>;
}) {
  const { category, topic } = await params;
  return <KidsDiscoveryPlayer category={category} startTopic={topic} />;
}
