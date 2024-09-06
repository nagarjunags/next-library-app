import { UserRepository } from "./users.repository";

export class TransactionRepository {
  userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async create(data: any) {
    // Check wether the user is present or not during the transaction
    if ((await this.userRepo.getById(data.userId)) === null) {
      return { status: "failed", error: "user not found" };
    }

    // Check the availability of the book
    let book = await this.bookRepo.getById(validatedData.bookId);
  }
}
