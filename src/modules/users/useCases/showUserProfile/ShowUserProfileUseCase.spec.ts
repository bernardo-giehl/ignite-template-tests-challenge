import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe ("Show user profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should not be able to show a non-existent user", async () => {
    expect(async() => { 
      await showUserProfileUseCase.execute("AAA1");
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to show a existent user", async () => {
    const userCreted: User = await createUserUseCase.execute({
      name: "User",
      email: "user@user.com.br",
      password: "1234",
    });
    const user = await showUserProfileUseCase.execute(userCreted.id!);
    expect(user).toHaveProperty("id");
  });

})