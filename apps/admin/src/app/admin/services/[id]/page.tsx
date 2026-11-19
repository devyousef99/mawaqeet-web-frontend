import { ServiceForm } from "@mawaqeet/ui/ServiceForm";

export default async function EditService({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServiceForm id={id} />;
}
