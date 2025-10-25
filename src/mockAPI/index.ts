import { Account, mockAccounts } from "./data/accounts";
import { Customer, mockCustomers } from "./data/customers";
import { mockTransactions, Transaction } from "./data/transactions";

// This function simulates a network delay.
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const queryAccounts = async (query: string): Promise<Account[]> => {
  // Simulate a network request latency
  await sleep(500);

  const lowerCaseQuery = query.toLowerCase();

  if (!lowerCaseQuery) {
    return [];
  }

  const accounts = mockAccounts.filter(
    (account) =>
      account.nickname.toLowerCase().includes(lowerCaseQuery) ||
      account.accountId.toLowerCase().includes(lowerCaseQuery)
  );

  return accounts;
};

export const queryTransactions = async (
  query: string
): Promise<Transaction[]> => {
  // Simulate a network request latency
  await sleep(500);

  const lowerCaseQuery = query.toLowerCase();

  if (!lowerCaseQuery) {
    return [];
  }

  const transactions = mockTransactions.filter(
    (trx) =>
      trx.merchant.toLowerCase().includes(lowerCaseQuery) ||
      trx.trxId.toLowerCase().includes(lowerCaseQuery)
  );

  return transactions;
};

export const queryCustomers = async (query: string): Promise<Customer[]> => {
  // Simulate a network request latency
  await sleep(500);

  const lowerCaseQuery = query.toLowerCase();

  if (!lowerCaseQuery) {
    return [];
  }

  const customers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(lowerCaseQuery) ||
      customer.email.toLowerCase().includes(lowerCaseQuery)
  );

  return customers;
};
