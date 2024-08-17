import { Customer } from "../domain/Customer";

export interface ICustomerRepository {
  create(
    id: number,
    firstName: string,
    lastName: string,
    balance: number,
    badCreditHistoryCount: number
  ): Customer;

  get(id: number): Customer | null;
}

export class CustomerRepository implements ICustomerRepository {
  private customers: Customer[] = [];

  create(
    id: number,
    firstName: string,
    lastName: string,
    balance: number,
    badCreditHistoryCount: number
  ) {
    const customer = new Customer(
      id,
      firstName,
      lastName,
      balance,
      badCreditHistoryCount
    );

    this.customers.push(customer);

    return customer;
  }

  get(id: number): Customer | null {
    return this.customers.find((customer) => customer.id === id) || null;
  }
}
