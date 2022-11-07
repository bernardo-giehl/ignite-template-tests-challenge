import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe ("Authenticate user", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should not be able to a authenticate a user with an email non-existent", async () => {
    expect( async () => {
      await authenticateUserUseCase.execute({
        email: "non@user.com.br",
        password: "1111",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to a authenticate a user with a wrong password", async () => {
    expect( async () => {
      await createUserUseCase.execute({
        name: "User",
        email: "user@user.com.br",
        password: "1234",
      });
      await authenticateUserUseCase.execute({
        email: "user@user.com.br",
        password: "1111",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to authenticate a existent user", async () => {
    const user = {
      name: "User",
      email: "user@user.com.br",
      password: "1234",
    }
    await createUserUseCase.execute(user);
    const authenticateUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    expect(authenticateUser).toHaveProperty("token");
  });

})