/* ------------------------------------------------------------------ */
/*  Mock data for the Mawaqeet dashboard                               */
/* ------------------------------------------------------------------ */

export type Status = "green" | "yellow" | "red";

export const employees = [
  { id: 1, name: "Martin Garrix", job: "Washer", status: "Available", dot: "green" as Status, rating: 4.5, ratingColor: "#10b981" },
  { id: 2, name: "Dua Lipa", job: "Nails specialist", status: "Vacation", dot: "yellow" as Status, rating: 3.5, ratingColor: "#f59e0b" },
  { id: 3, name: "Dua Lipa", job: "Facial", status: "Working", dot: "red" as Status, rating: 5, ratingColor: "#10b981" },
  { id: 4, name: "Martin Garrix", job: "Barber", status: "Booked", dot: "yellow" as Status, rating: 4.5, ratingColor: "#6c5ce7" },
  { id: 5, name: "Martin Garrix", job: "Massage", status: "Available", dot: "green" as Status, rating: 5, ratingColor: "#4834d4" },
  { id: 6, name: "Martin Garrix", job: "Dentist", status: "Available", dot: "green" as Status, rating: 4.5, ratingColor: "#6c5ce7" },
  { id: 7, name: "Dua Lipa", job: "Worker", status: "Available", dot: "green" as Status, rating: 4.5, ratingColor: "#6c5ce7" },
];

export const services = [
  { id: 1, name: "45 full Body Massage", desc: "45 Minutes full body massaging includes feet, hand an nick with a Thailand way therapy", type: "Massage", employees: 11, slot: "45", slotUnit: "MINUTES", hours: "10 AM - 11 PM", price: "160 S.R", icon: "massage", dot: "green" as Status },
  { id: 2, name: "1H full body Massage", desc: "1hour full body massaging includes feet, hand an nick with a Thailand way therapy", type: "Massage", employees: 18, slot: "1", slotUnit: "HOURS", hours: "10 AM - 11 PM", price: "180 S.R", icon: "massage", dot: "green" as Status },
  { id: 3, name: "Nail Treatment", desc: "45 minutes of nail treatment includes the hand and the foot.", type: "Body Care", employees: 3, slot: "1", slotUnit: "HOURS", hours: "10 AM - 11 PM", price: "180 S.R", icon: "nails", dot: "red" as Status },
  { id: 4, name: "Beard Shaving", desc: "Beard shaving service include skin cleaning.", type: "Barber", employees: 3, slot: "45", slotUnit: "MINUTES", hours: "10 AM - 11 PM", price: "180 S.R", icon: "beard", dot: "yellow" as Status },
  { id: 5, name: "Moroccan Bath", desc: "45 minutes of Moroccan bath treatment and relaxing shift between hot and cold waters", type: "Beauty", employees: 3, slot: "45", slotUnit: "MINUTES", hours: "10 AM - 11 PM", price: "180 S.R", icon: "bath", dot: "green" as Status },
  { id: 6, name: "1H Hot Stone", desc: "1hour full body massaging includes feet, hand an nick with a Thailand - Hot Stone way therapy", type: "Massage", employees: 3, slot: "1", slotUnit: "HOURS", hours: "10 AM - 11 PM", price: "180 S.R", icon: "hotstone", dot: "green" as Status },
  { id: 7, name: "1.5H Hot Stone", desc: "1hour full body massaging includes feet, hand an nick with a Aroma - Hot Stone way therapy", type: "Massage", employees: 3, slot: "1 HOURS , 30", slotUnit: "MINUTES", hours: "10 AM - 11 PM", price: "180 S.R", icon: "hotstone", dot: "green" as Status },
];

export const appointments = [
  { id: "#0123432", customer: "Abdullah Ali Al-Raddadi", number: "0563318055", service: "45 minutes full Body Massage", icon: "hotstone", type: "Massage", branch: "Medina", slot: "45 MINUTES", time: "10 AM - 11 PM", price: "160 S.R", dot: "green" as Status },
  { id: "#0123433", customer: "Yazan Turjoman", number: "0563318055", service: "Nail Treatment", icon: "nails", type: "Massage", branch: "Medina", slot: "45 MINUTES", time: "10 AM - 11 PM", price: "160 S.R", dot: "red" as Status },
  { id: "#0123434", customer: "Yousef Abdullah Bukhari", number: "0563318055", service: "Beard shaving", icon: "beard", type: "Barber", branch: "Medina", slot: "45 MINUTES", time: "10 AM - 11 PM", price: "160 S.R", dot: "yellow" as Status },
  { id: "#0123435", customer: "Yousef Abdullah Bukhari", number: "0563318055", service: "Moroccan Bath", icon: "bath", type: "Beauty", branch: "Medina", slot: "45 MINUTES", time: "10 AM - 11 PM", price: "160 S.R", dot: "yellow" as Status },
  { id: "#0123436", customer: "Yousef Abdullah Bukhari", number: "0563318055", service: "1 Hour Hot Stone", icon: "hotstone", type: "Massage", branch: "Medina", slot: "45 MINUTES", time: "10 AM - 11 PM", price: "160 S.R", dot: "red" as Status },
  { id: "#0123437", customer: "Yousef Abdullah Bukhari", number: "0563318055", service: "Beard shaving", icon: "beard", type: "Barber", branch: "Medina", slot: "45 MINUTES", time: "10 AM - 11 PM", price: "160 S.R", dot: "yellow" as Status },
  { id: "#0123438", customer: "Yazan Turjoman", number: "0563318055", service: "Nail Treatment", icon: "nails", type: "Massage", branch: "Medina", slot: "45 MINUTES", time: "10 AM - 11 PM", price: "160 S.R", dot: "red" as Status },
];

export const loyalCustomers = [
  { rank: 1, name: "Abdullah Ali Alraddadi", number: "0563318055", bookings: 45, service: "1 Hour Hot Stone", icon: "hotstone", category: "Massage", branch: "Medina", last: "20/11/2022", rating: 5, booking: 5678, dot: "green" as Status },
  { rank: 2, name: "Yousef Abdullah Bukhari", number: "0563318055", bookings: 35, service: "Nail Treatment", icon: "nails", category: "Massage", branch: "Medina", last: "13/01/2023", rating: 4.5, booking: 4597, dot: "green" as Status },
];

export const complains = [
  { n: 1, name: "Abdullah Ali Alraddadi", number: "0563318055", type: "BRANCH", msg: "functionality issue ; in my ….", attach: "Yes", city: "Medina", ref: "73526" },
  { n: 2, name: "Yousef Abdullah Bukhari", number: "0563318055", type: "PROVIDER", msg: "functionality issue ; in my ….", attach: "No", city: "Medina", ref: "73526" },
  { n: 3, name: "Yousef Abdullah Bukhari", number: "0563318055", type: "CUSTOMER", msg: "functionality issue ; in my ….", attach: "Yes", city: "Medina", ref: "73526" },
  { n: 4, name: "Yousef Abdullah Bukhari", number: "0563318055", type: "CUSTOMER CARE", msg: "functionality issue ; in my ….", attach: "No", city: "Medina", ref: "73526" },
];

export const subscribers = [
  { id: 432, name: "Abdullah Ali Alraddadi", number: "0563318055", type: "Basic", paid: "YES", status: "ACTIVE", renewal: 12, daysLeft: 21, dot: "green" as Status },
  { id: 123, name: "Yousef Abdullah Bukhari", number: "0563318055", type: "PRO", paid: "NO", status: "HOLD", renewal: 0, daysLeft: 120, dot: "yellow" as Status },
  { id: 4324, name: "Yousef Abdullah Bukhari", number: "0563318055", type: "BASIC", paid: "YES", status: "EXPIRED", renewal: 0, daysLeft: 0, dot: "red" as Status },
  { id: 432123, name: "Yousef Abdullah Bukhari", number: "0563318055", type: "PRO", paid: "YES", status: "ACTIVE", renewal: 56, daysLeft: 98, dot: "green" as Status },
];

export const promotions = [
  { name: "RAMADAN2023", start: "31/01/2023", end: "19/02/2023", service: "1 Hour Hot Stone", icon: "hotstone", category: "Massage", branch: "Medina", capacity: 45, available: 12, on: true, dot: "green" as Status },
  { name: "OFFER131", start: "31/02/2023", end: "06/03/2023", service: "Nail Treatment", icon: "nails", category: "Massage", branch: "Medina", capacity: 45, available: 11, on: false, dot: "red" as Status },
];

export const monthlyProgress = [
  { m: "JANUARY", a: 12, b: 0 }, { m: "FEBURARY", a: 0, b: 28 }, { m: "MARCH", a: 22, b: 0 },
  { m: "APRL", a: 0, b: 18 }, { m: "MAY", a: 42, b: 0 }, { m: "JUNE", a: 0, b: 24 },
  { m: "JULY", a: 25, b: 0 }, { m: "AUGUST", a: 0, b: 38 }, { m: "SPETEMPER", a: 44, b: 0 },
  { m: "OCTOBER", a: 0, b: 46 }, { m: "NOVEMBER", a: 48, b: 0 }, { m: "DECEMBER", a: 0, b: 36 },
];

export const weekSales = [
  { d: "SUNDAY", v: 42 }, { d: "MONDAY", v: 14 }, { d: "TUESEDAY", v: 30 },
  { d: "WEDNESDAY", v: 13 }, { d: "THURSDAY", v: 36 }, { d: "FRIDAY", v: 40 },
];

export const todayPerf = Array.from({ length: 24 }, (_, h) => ({
  h,
  today: Math.round(28 + 18 * Math.sin(h / 2.6) + 8 * Math.sin(h / 1.1)),
  yesterday: Math.round(30 + 12 * Math.sin(h / 3.1 + 1.5)),
}));

export const adminStats = [
  { label: "Monthly Active Android Users", value: "15989" },
  { label: "Monthly Active iOS Users", value: "25999" },
  { label: "TOTAL Subscribtions", value: "35694" },
  { label: "Monthly Active Providers", value: "35694" },
  { label: "Total income from Subscribtions", value: "15k S.R" },
  { label: "Monthly Completed Appointments", value: "3456456" },
  { label: "Total Appointment Request form Android", value: "35694" },
  { label: "Total Appointment Request form iOS", value: "35694" },
  { label: "Most subscribed Package from providers", value: "Basic" },
  { label: "Total of Branch Users", value: "3456" },
  { label: "Total income from iOS", value: "12k S.R" },
  { label: "Highest Requests City", value: "Jeddah" },
  { label: "TOTAL Downloads for Applications", value: "35694" },
  { label: "Most Active Category from Customers", value: "Beauty and Health" },
  { label: "Most used category from providers", value: "Beauty and Health" },
  { label: "Total of Customer Care Users", value: "1256" },
  { label: "Total income from Android", value: "11k S.R" },
  { label: "Highest Request Month", value: "August" },
];

export const days = ["SUNDAY", "MONDAY", "TUESEDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

/* ------------------------------------------------------------------ */
/*  Dummy option lists for dropdowns (testing only)                    */
/* ------------------------------------------------------------------ */

export type Option<T extends string | number = string> = { value: T; label: string };
const opts = (xs: readonly string[]): Option[] => xs.map(x => ({ value: x, label: x }));

export const categoryOptions = opts(["MASSAGE", "BODY CARE", "BARBER", "BEAUTY", "DENTAL", "SPA"]);
export const serviceTypeOptions = categoryOptions;
export const branchOptions = opts(["MEDINA", "JEDDAH", "RIYADH", "MAKKAH", "DAMMAM"]);
export const providerOptions = opts(["ROYAL SPA", "GOLDEN HANDS", "BLUE LOTUS", "OASIS CARE"]);
export const currencyOptions = opts(["SR", "USD", "AED"]);
export const durationUnitOptions = opts(["MINUTES", "HOURS"]);
export const meridiemOptions = opts(["AM", "PM"]);
export const hourOptions: Option<number>[] = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
export const countOptions = (max: number, min = 1): Option<number>[] =>
  Array.from({ length: max - min + 1 }, (_, i) => ({ value: min + i, label: String(min + i) }));
export const approvalOptions = opts(["FULL PAYMENT", "DEPOSIT", "NO PAYMENT", "ADMIN APPROVAL"]);
export const dayOptions = opts(days);
export const jobOptions = opts(["MASSAGE", "WASHER", "NAILS SPECIALIST", "FACIAL", "BARBER", "DENTIST", "WORKER"]);
export const workingStatusOptions = opts(["AVAILABLE", "VACATION", "WORKING", "BOOKED"]);
export const userTypeOptions = opts(["CUSTOMER", "PROVIDER", "BRANCH", "CUSTOMER CARE"]);
export const subscriptionTypeOptions = opts(["BASIC", "PRO", "ENTERPRISE"]);
export const cityOptions = branchOptions;
export const monthOptions = opts(["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]);

/** Working-hour slots a provider can open for booking. */
export const timeSlots = ["10 AM", "11 AM", "12 PM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "06 PM", "07 PM", "08 PM", "09 PM", "10 PM"];

export const serviceIconOptions = opts(["massage", "hotstone", "nails", "beard", "bath"]);

/* ------------------------------------------------------------------ */
/*  Record shapes used by the localStorage-backed demo store           */
/* ------------------------------------------------------------------ */
export type Employee = (typeof employees)[number];
export type Service = (typeof services)[number];
export type Appointment = (typeof appointments)[number];
export type LoyalCustomer = (typeof loyalCustomers)[number];
export type Complain = (typeof complains)[number];
export type Subscriber = (typeof subscribers)[number];
export type Promotion = (typeof promotions)[number];

/** A day-plan created from the "Create Appointments" screen. */
export type AppointmentPlan = {
  id: string;
  category: string;
  service: string;
  employees: number;
  day: string;
  approval: string;
  slots: string[];
  repeat: { week: boolean; month: boolean; year: boolean };
  createdAt: string;
};
