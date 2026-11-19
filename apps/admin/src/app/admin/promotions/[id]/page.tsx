import { PromoForm } from "@mawaqeet/ui/PromoForm";

export default async function EditPromotion({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PromoForm id={id} />;
}
