import assert from "assert";
import { Customer } from "../src/domain/Customer";
import { NotEligibleForMortgageException } from "../src/exceptions/NotEligibleForMortgageException";
import { WrongDataException } from "../src/exceptions/WrongDataException";
import { MortgageApplicationQueueProcessor } from "../src/MortgageApplicationQueueProcessor";
import { ICustomerRepository } from "../src/repositories/customerRepository";

describe("MortgageApplicationQueueProcessor", () => {
  class CustomerRepositoryMock implements ICustomerRepository {
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

  const customerRepo = new CustomerRepositoryMock();

  const process = (
    customerId: number,
    amountRequested: number,
    customerRepositoryMock: ICustomerRepository
  ) => {
    const processor = new MortgageApplicationQueueProcessor(
      customerRepositoryMock
    );
    try {
      processor.processRequest(customerId, amountRequested);
    } catch (e) {
      if (e instanceof NotEligibleForMortgageException) return;

      throw e;
    }
  };

  describe("happy path test", () => {
    [
      [1, 1000, 0, 500, 1500],
      [2, 240, 0, 100, 340],
      [3, 0, 0, 400, 0],
      [4, 500, 1, 1000, 500],
    ].forEach(
      ([
        customerId,
        balance,
        badCreditHistoryCount,
        amountRequested,
        expected,
      ]) => {
        it(`given a customerId ${customerId} when is valid then request is processed`, () => {
          // const customer = new Customer(
          //   customerId,
          //   "first",
          //   "last",
          //   balance,
          //   badCreditHistoryCount
          // );

          const customer = customerRepo.create(
            customerId,
            "first",
            "last",
            balance,
            badCreditHistoryCount
          );

          process(customerId, amountRequested, customerRepo);
          assert.strictEqual(customer.balance, expected);
        });
      }
    );
  });

  describe("unhappy path test", () => {
    it(`given a customerId when not valid then request fails`, () => {
      const customerId = 1000;
      const amountRequested = 1500;

      assert.throws(
        () => process(customerId, amountRequested, customerRepo),
        WrongDataException
      );
    });
  });
});
