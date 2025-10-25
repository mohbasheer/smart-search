export interface Transaction {
  trxId: string;
  merchant: string;
  amount: number;
  posted: string;
  accountId: string;
}

export const mockTransactions: Transaction[] = [
  {
    trxId: "trx-201",
    merchant: "Amazon",
    amount: -78.54,
    posted: "2025-10-24",
    accountId: "acc-101",
  },
  {
    trxId: "trx-202",
    merchant: "Whole Foods",
    amount: -123.45,
    posted: "2025-10-23",
    accountId: "acc-101",
  },
  {
    trxId: "trx-203",
    merchant: "Paycheck Deposit",
    amount: 2500.0,
    posted: "2025-10-22",
    accountId: "acc-101",
  },
  {
    trxId: "trx-204",
    merchant: "Shell Gas",
    amount: -55.0,
    posted: "2025-10-21",
    accountId: "acc-104",
  },
];
