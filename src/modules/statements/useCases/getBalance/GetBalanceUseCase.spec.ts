import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

describe ("Get balance", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should not be able to get balance with a non-existent user", async () => {
    expect(async() => {
      await getBalanceUseCase.execute({user_id: "123"});
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to get balance with a existent user", async () => {
    const userCreted = await createUserUseCase.execute({
      name: "User",
      email: "user@user.com.br",
      password: "1234",
    });

    const balanceCreated = await getBalanceUseCase.execute({user_id: userCreted.id!});
    expect(balanceCreated).toHaveProperty("balance");
  });

})