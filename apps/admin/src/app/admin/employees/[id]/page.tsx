import { EmployeeForm } from "@mawaqeet/ui/EmployeeForm";

export default async function EditEmployee({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EmployeeForm id={id} />;
}
