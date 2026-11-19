"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageCard } from "@mawaqeet/ui/TableShell";
import { ActionBar } from "@mawaqeet/ui/ui";
import { FormNotice, SelectField, TextField } from "@mawaqeet/ui/form";
import { useStore, nextNumericId } from "@mawaqeet/ui/store";
import { userTypeOptions, branchOptions } from "@mawaqeet/data";
import { seedUsers, type UserRecord } from "../data";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[14px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">{children}</div>
);

export default function CreateUser() {
  const router = useRouter();
  const store = useStore<UserRecord>("users", seedUsers);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");
  const [branch, setBranch] = useState("MEDINA");
  const [notice, setNotice] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  const save = () => {
    if (!name.trim()) return setNotice({ kind: "error", text: "User name is required." });
    if (password.length < 8) return setNotice({ kind: "error", text: "Password must be at least 8 characters." });
    if (!type) return setNotice({ kind: "error", text: "Choose a user type." });
    store.add({ id: nextNumericId(store.items), name: name.trim(), number, type, branch: branch.charAt(0) + branch.slice(1).toLowerCase(), dot: "green" });
    setNotice({ kind: "success", text: "User created." });
    setTimeout(() => router.push("/admin/users"), 400);
  };

  return (
    <PageCard className="min-h-[70vh]">
      <form onSubmit={e => { e.preventDefault(); save(); }} noValidate className="max-w-md">
        <h2 className="mb-8 text-2xl font-extrabold tracking-wide text-neutral-800 dark:text-white">Create User</h2>
        <Label>User name</Label>
        <TextField value={name} onChange={setName} placeholder="ENTER USER NAME" center className="mb-6" />
        <Label>Phone number</Label>
        <TextField type="tel" value={number} onChange={setNumber} placeholder="05XXXXXXXX" center className="mb-6" />
        <Label>Password</Label>
        <TextField type="password" value={password} onChange={setPassword} placeholder="MIN 8 CHARACTERS" center className="mb-6" />
        <Label>User type</Label>
        <SelectField value={type} onChange={setType} options={userTypeOptions} placeholder="SELECT USER TYPE" center className="mb-6" />
        <Label>Branch</Label>
        <SelectField value={branch} onChange={setBranch} options={branchOptions} center />
        {notice && <FormNotice kind={notice.kind}>{notice.text}</FormNotice>}
        <ActionBar onCancel={() => router.push("/admin/users")} />
      </form>
    </PageCard>
  );
}
