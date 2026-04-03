import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MembershipPlan {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  planId: string;
  startDate: string;
  expiryDate: string;
  amountPaid: number;
  totalAmount: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: "owner" | "member";
  memberId?: string;
}

const STORAGE_KEYS = {
  PLANS: "fitness_empire_plans",
  MEMBERS: "fitness_empire_members",
  USERS: "fitness_empire_users",
  CURRENT_USER: "fitness_empire_current_user",
  INITIALIZED: "fitness_empire_initialized",
};

const DEFAULT_PLANS: MembershipPlan[] = [
  { id: "1", name: "1 Month", durationMonths: 1, price: 1500 },
  { id: "2", name: "3 Months", durationMonths: 3, price: 4000 },
  { id: "3", name: "6 Months", durationMonths: 6, price: 7000 },
  { id: "4", name: "12 Months", durationMonths: 12, price: 12000 },
];

const DEFAULT_OWNER: User = {
  id: "owner-1",
  email: "owner@fitnessempire.com",
  password: "admin123",
  role: "owner",
};

export async function initializeStorage(): Promise<void> {
  const initialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (initialized) return;

  await AsyncStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(DEFAULT_PLANS));
  await AsyncStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([]));
  await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_OWNER]));
  await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
}

export async function getPlans(): Promise<MembershipPlan[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.PLANS);
  return data ? JSON.parse(data) : DEFAULT_PLANS;
}

export async function updatePlan(plan: MembershipPlan): Promise<void> {
  const plans = await getPlans();
  const index = plans.findIndex((p) => p.id === plan.id);
  if (index !== -1) {
    plans[index] = plan;
    await AsyncStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }
}

export async function getMembers(): Promise<Member[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.MEMBERS);
  return data ? JSON.parse(data) : [];
}

export async function getMember(id: string): Promise<Member | null> {
  const members = await getMembers();
  return members.find((m) => m.id === id) || null;
}

export async function addMember(member: Omit<Member, "id" | "createdAt">): Promise<Member> {
  const members = await getMembers();
  const users = await getUsers();
  
  const newMember: Member = {
    ...member,
    id: `member-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  members.push(newMember);
  await AsyncStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  
  const memberUser: User = {
    id: `user-${Date.now()}`,
    email: member.email,
    password: member.phone.slice(-4) || "1234",
    role: "member",
    memberId: newMember.id,
  };
  users.push(memberUser);
  await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  return newMember;
}

export async function updateMember(member: Member): Promise<void> {
  const members = await getMembers();
  const index = members.findIndex((m) => m.id === member.id);
  if (index !== -1) {
    members[index] = member;
    await AsyncStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }
}

export async function deleteMember(id: string): Promise<void> {
  const members = await getMembers();
  const filtered = members.filter((m) => m.id !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(filtered));
  
  const users = await getUsers();
  const filteredUsers = users.filter((u) => u.memberId !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
}

export async function getUsers(): Promise<User[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [DEFAULT_OWNER];
}

export async function login(email: string, password: string): Promise<User | null> {
  const users = await getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
  return user || null;
}

export async function getCurrentUser(): Promise<User | null> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function calculateExpiryDate(startDate: string, durationMonths: number): string {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + durationMonths);
  return date.toISOString();
}

export function getDaysRemaining(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getMembershipStatus(expiryDate: string): "active" | "expiring" | "expired" {
  const daysRemaining = getDaysRemaining(expiryDate);
  if (daysRemaining < 0) return "expired";
  if (daysRemaining <= 7) return "expiring";
  return "active";
}
