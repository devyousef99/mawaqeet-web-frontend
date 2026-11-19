import { loyalCustomers, type LoyalCustomer, type Status } from "@mawaqeet/data";

export type UserRecord = Partial<LoyalCustomer> & { id: number; name: string; type: string; number: string; branch: string; dot: Status; blocked?: boolean };
export const seedUsers: UserRecord[] = loyalCustomers.map(c => ({ ...c, id: c.rank, type: "CUSTOMER" }));
