import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { UserService } from "./user.service";
import { HTTPError } from "../utils";

describe("UserService Unit Tests", () => {
  let service: UserService;
  let mockUserRepository: any;
  let mockTweetService: any;
  let mockFollowService: any;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      findByUsername: jest.fn(),
    };

    mockTweetService = {
      listTweetsByUserId: jest.fn(),
    };

    mockFollowService = {
      listFollowings: jest.fn(),
    };

    service = new UserService(
      mockUserRepository,
      mockTweetService,
      mockFollowService
    );
  });

  it("should throw a 404 error if user is not found", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(service.getById("invalid-id")).rejects.toThrow(
      new HTTPError(404, "User not found")
    );
  });

  it("should return a user model if ID is valid", async () => {
    const mockUserDB = {
      id: "123",
      name: "Agatha",
      username: "agatha_dev",
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserRepository.findById.mockResolvedValue(mockUserDB);
    mockTweetService.listTweetsByUserId.mockResolvedValue([]);
    mockFollowService.listFollowings.mockResolvedValue({ 
      followers: [], 
      followings: [] 
    });

    const result = await service.getById("123");

    expect(result.name).toBe("Agatha");
    expect(mockUserRepository.findById).toHaveBeenCalledWith("123");
  });
});