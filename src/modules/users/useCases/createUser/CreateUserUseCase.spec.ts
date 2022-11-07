import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe ("Create user", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a user", async () => {
    const userCreted = await createUserUseCase.execute({
      name: "User",
      email: "user@user.com.br",
      password: "1234",
    });
    expect(userCreted).toHaveProperty("id");
  });

  it("should not be able to create a user with an email already existent", async () => {
    expect( async () => {
      await createUserUseCase.execute({
        name: "User1",
        email: "user@user.com.br",
        password: "1111",
      });
      await createUserUseCase.execute({
        name: "User2",
        email: "user@user.com.br",
        password: "222",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

})