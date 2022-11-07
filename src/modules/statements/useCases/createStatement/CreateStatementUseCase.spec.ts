import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe ("Create Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should not be able to create a statement with a non-existent user", async () => {
    expect(async() => { 
      const statement = {
        user_id: "123",
        type: OperationType.DEPOSIT,
        amount: 123.22,
        description: "lalaland",
      }
      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a statement type 'withdraw' without funds", async () => {
    expect(async() => { 
      const userCreted = await createUserUseCase.execute({
        name: "User",
        email: "user@user.com.br",
        password: "1234",
      });

      const statement = {
        user_id: userCreted.id!,
        type: OperationType.WITHDRAW,
        amount: 123.22,
        description: "lalaland",
      }
      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });
  
  it("should be able to create a statement type 'deposit'", async () => {
    const userCreted = await createUserUseCase.execute({
      name: "User",
      email: "user@user.com.br",
      password: "1234",
    });
    const statement = {
      user_id: userCreted.id!,
      type: OperationType.DEPOSIT,
      amount: 123.22,
      description: "lalaland",
    }
    const statementCreated = await createStatementUseCase.execute(statement);
    expect(statementCreated).toHaveProperty("id");
  });

  it("should be able to create a statement type 'withdraw' if has funds", async () => {
    const userCreted = await createUserUseCase.execute({
      name: "User",
      email: "user@user.com.br",
      password: "1234",
    });
    const statementDeposit = {
      user_id: userCreted.id!,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "lalaland",
    }
    await createStatementUseCase.execute(statementDeposit);

    const statementWithdraw = {
      user_id: userCreted.id!,
      type: OperationType.WITHDRAW,
      amount: 150,
      description: "lalaland",
    }
    const statementCreated = await createStatementUseCase.execute(statementWithdraw);
    expect(statementCreated).toHaveProperty("id");
  });

})