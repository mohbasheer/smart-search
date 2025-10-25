export interface Customer {
  customerId: string;
  name: string;
  email: string;
  memberSince: string;
}

export const mockCustomers = [
  {
    customerId: "cust-301",
    name: "John Doe",
    email: "john.doe@example.com",
    memberSince: "2018-05-15",
  },
  {
    customerId: "cust-302",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    memberSince: "2020-01-20",
  },
  {
    customerId: "cust-303",
    name: "Peter Jones",
    email: "peter.jones@example.com",
    memberSince: "2015-11-30",
  },
  {
    customerId: "cust-304",
    name: "Samantha Bee",
    email: "samantha.bee@example.com",
    memberSince: "2022-02-10",
  },
];
