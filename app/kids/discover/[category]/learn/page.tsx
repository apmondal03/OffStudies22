import { KidsDiscoveryPlayer } from "@/components/kids/KidsDiscoveryPlayer";

export default async function KidsDiscoverLearnAllPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <KidsDiscoveryPlayer category={category} />;
}
