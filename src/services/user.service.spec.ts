import { UserService } from "./user.service";
import { IUserRepository } from "../interfaces/user-repository.interface";

describe("UserService", () => {
  let service: UserService;
  let mockRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn()
    } as any;
    service = new UserService(mockRepo);
  });

  it("should throw 404 if user does not exist", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getById("invalid-id")).rejects.toThrow("User not found");
  });
});