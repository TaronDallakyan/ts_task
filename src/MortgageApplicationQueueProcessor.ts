import { Customer } from "./domain/Customer";
import { WrongDataException } from "./exceptions/WrongDataException";
import { ICustomerRepository } from "./repositories/customerRepository";

export class MortgageApplicationQueueProcessor {
  customerRepository: ICustomerRepository;

  constructor(customerRepository: ICustomerRepository) {
    this.customerRepository = customerRepository;
  }

  static MESSAGE_INVALID_CUSTOMER = "Customer not found!";

  checkWrongData(customer: Customer | null): void {
    if (!customer)
      throw new WrongDataException(
        MortgageApplicationQueueProcessor.MESSAGE_INVALID_CUSTOMER
      );
  }

  processRequest(customerId: number, amountRequested: number): void {
    this.updateBalance(customerId, amountRequested);
  }
  updateBalance(customerId: number, amountRequested: number): void {
    const customer = this.getCustomer(customerId);
    customer?.updateBalance(amountRequested);
  }
  getCustomer(customerId: number): Customer | null {
    const customer = this.customerRepository.get(customerId);
    this.checkWrongData(customer);
    return customer;
  }
}
