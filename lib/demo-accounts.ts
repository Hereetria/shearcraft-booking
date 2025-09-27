export const DEMO_ACCOUNTS = {
  CUSTOMER: {
    email: "demo@customer.com",
    password: "demo123",
    role: "CUSTOMER" as const,
    name: "Demo Customer"
  },
  ADMIN: {
    email: "demo@admin.com", 
    password: "demo123",
    role: "ADMIN" as const,
    name: "Demo Admin"
  }
} as const;

export type DemoAccountType = keyof typeof DEMO_ACCOUNTS;
