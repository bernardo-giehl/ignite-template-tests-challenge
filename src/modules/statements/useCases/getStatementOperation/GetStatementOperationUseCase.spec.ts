import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe ("Get statement operation", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should not be able to get statement operation with a non-existent user", async () => {
    expect(async() => {
      await getStatementOperationUseCase.execute({
        user_id: "123", 
        statement_id: "123",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
  
  it("should not be able to get statement operation with a non-existent statement", async () => {
    expect(async() => {
      const userCreted = await createUserUseCase.execute({
        name: "User",
        email: "user@user.com.br",
        password: "1234",
      });
      await getStatementOperationUseCase.execute({
        user_id: userCreted.id!, 
        statement_id: "123",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to get balance with a existent user", async () => {
    const userCreted = await createUserUseCase.execute({
      name: "User",
      email: "user@user.com.br",
      password: "1234",
    });
    const statementCreated = await createStatementUseCase.execute({
      user_id: userCreted.id!,
      type: OperationType.DEPOSIT,
      amount: 150,
      description: "lalaland",
    });
    const balanceCreated = await getStatementOperationUseCase.execute({
      user_id: userCreted.id!,
      statement_id: statementCreated.id!,
    });
    expect(balanceCreated).toHaveProperty("id");
  });

})