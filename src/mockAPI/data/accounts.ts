export interface Account {
  accountId: string;
  nickname: string;
  balance: number;
  type: "checking" | "savings";
}

export const mockAccounts: Account[] = [
  {
    accountId: "acc-101",
    nickname: "Primary Checking",
    balance: 15432.1,
    type: "checking",
  },
  {
    accountId: "acc-102",
    nickname: "Vacation Savings",
    balance: 8765.43,
    type: "savings",
  },
  {
    accountId: "acc-103",
    nickname: "Emergency Fund",
    balance: 25000.0,
    type: "savings",
  },
  {
    accountId: "acc-104",
    nickname: "Business Platinum",
    balance: 123456.78,
    type: "checking",
  },
];
