import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import {
  logWeight,
  getWeightLog,
  addFriend,
  deleteFriend,
  getAllFriends,
  getAllFriendWeightLogs,
  getNameFromId,
} from "../../src/services/user.service.js";
import User from "../../src/models/user.model.js";

describe("User service tests", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  beforeEach(() => {
    vi.mock("./../../src/models/user.model.js", () => {
      return {
        default: vi.fn(),
      };
    });
  });

  User.findOne = vi.fn();

  describe("logWeight", () => {
    it("should add a log object to the weight log", async () => {
      const testDate = new Date();
      const testDate2 = new Date(testDate.getTime() + 5 * 24 * 60 * 60 * 1000);
      const testDate3 = new Date(testDate2.getTime() + 5 * 24 * 60 * 60 * 1000);

      const testWeightLog = [
        { weight: 97.2, date: testDate },
        { weight: 97.4, date: testDate2 },
      ];
      const mockUser = {
        weight_log: testWeightLog,
        save: vi.fn(),
      };
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });

      const logObject = {
        weight: 93.7,
        date: testDate3,
      };

      const userId = "666a1aa8024c522d8a3692f3";
      await logWeight(userId, logObject);

      expect(mockUser.save).toBeCalled();
      expect(mockUser.weight_log).toContain(logObject);
    });
    it("should not save a log object with the same day as a previous log", async () => {
      const testDate = new Date();
      const testWeightLog = [{ weight: 97.2, date: testDate }];
      const mockUser = {
        weight_log: testWeightLog,
        save: vi.fn(),
      };
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });

      const logObject = {
        weight: 93.7,
        date: testDate,
      };

      const userId = "666a1aa8024c522d8a3692f3";
      await logWeight(userId, logObject);

      expect(mockUser.save).not.toBeCalled();
    });
    it("should throw an error when a user is not found", async () => {
      const testDate = new Date();
      const userId = "666a1aa8024c522d8a3692f3";
      const logObject = {
        weight: 90.5,
        date: testDate,
      };
      await expect(() => logWeight(userId, logObject)).rejects.toThrowError();
    });
  });

  describe("getWeightLog", () => {
    it("should return the weight log for the given user id", async () => {
      const mockUser = {
        weight_log: { weight: 97.2, date: new Date() },
      };
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });

      const userId = "666a1aa8024c522d8a3692f3";
      const result = await getWeightLog(userId);

      expect(User.findOne).toBeCalled();
      expect(result).toStrictEqual(mockUser.weight_log);
    });
    it("should throw an error when no user is found", async () => {
      const mockExec = vi.fn().mockResolvedValue(null);
      User.findOne.mockReturnValue({ exec: mockExec });
      const userId = "666a1aa8024c522d8a3692f3";
      await expect(() => getWeightLog(userId)).rejects.toThrowError();
    });
  });

  describe("addFriend", async () => {
    it("should add a friend to the user", async () => {
      const mockUser = {
        friends: ["friend1", "friend2"],
        save: vi.fn(),
      };
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });

      const newFriendId = "friend3";

      const userId = "666a1aa8024c522d8a3692f3";
      await addFriend(userId, newFriendId);

      expect(User.findOne).toHaveBeenCalledWith({ _id: userId });
      expect(mockExec).toHaveBeenCalled();
      expect(mockUser.friends).toContain(newFriendId);
      expect(mockUser.save).toBeCalled();
    });
    it("should throw an error if the friend is not added", async () => {
      const newFriendId = "friend3";
      const userId = "666a1aa8024c522d8a3692f3";
      await expect(addFriend(userId, newFriendId)).rejects.toThrowError();
    });
  });
  describe("getAllFriends", () => {
    it("should return all friends when given a valid userId", async () => {
      const mockUser = {
        friends: ["friend1", "friend2"],
      };
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });

      const userId = "666a1aa8024c522d8a3692f3";
      const friends = await getAllFriends(userId);

      expect(friends).toEqual(["friend1", "friend2"]);
    });
  });
  it("should throw an error when getting the friends array fails", async () => {
    await expect(getAllFriends()).rejects.toThrowError();
  });

  describe("deleteFriend", () => {
    it("should remove a friend from the friends array", async () => {
      const mockUser = {
        friends: ["friend1", "friend2"],
        save: vi.fn(),
      };
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });

      const userId = "666a1aa8024c522d8a3692f3";
      await deleteFriend(userId, "friend2");
      expect(mockUser.save).toBeCalled();
      expect(mockUser.friends).toEqual(["friend1"]);
    });
    it("should throw an error if friend is not found", async () => {
      const mockUser = {
        friends: ["friend1", "friend2"],
      };
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });

      const userId = "666a1aa8024c522d8a3692f3";
      await expect(deleteFriend(userId, "friend3")).rejects.toThrowError();
    });
  });
  describe("getNameFromId", async () => {
    it("should return the full name given a user id", async () => {});
    const mockUser = {
      full_name: {
        first_name: "Malcolm",
        middle_name: "",
        last_name: "Strong",
      },
    };
    const mockExec = vi.fn().mockResolvedValue(mockUser);
    User.findOne.mockReturnValue({ exec: mockExec });

    const userId = "666a1aa8024c522d8a3692f3";

    const fullName = await getNameFromId(userId);
    expect(fullName).toStrictEqual({
      first_name: "Malcolm",
      middle_name: "",
      last_name: "Strong",
    });
    it("should throw an error if the userId is not found", async () => {
      const mockExec = vi.fn().mockResolvedValue(null);
      User.findOne.mockReturnValue({ exec: mockExec });
      await expect(getNameFromId()).rejects.toThrowError();
    });
  });
  describe("getAllFriendWeightLogs", async () => {
    it.skip("should return the logs of all your friends in an array", async () => {
      // vi.mock("../../src/services/user.service.js", () => {
      //   return {
      //     getNameFromId: vi.fn(),
      //   };
			// });
			vi.mo
      const mockUser = {
        friends: ["friend1", "friend2"],
      };
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });

      const mockGetNameFromId = getNameFromId;

      // mockGetNameFromId.mockImplementation((id) => {
      //   return `Mocked Name for id: ${id}`;
      // });

      const friendLog1 = [{ weight: 80, date: new Date() }];
      const friendLog2 = [{ weight: 75, date: new Date() }];

      // mockGetWeightLog.mockImplementationOnce(() => friendLog1);
      // mockGetWeightLog.mockImplementationOnce(() => friendLog2);

      // const mockGetNameFromId = vi.fn().mockImplementation(getNameFromId);
      // mockGetNameFromId.mockImplementationOnce(() => "James");
      // mockGetNameFromId.mockImplementationOnce(() => "Harry");

      const userId = "666a1aa8024c522d8a3692f3";

      await getAllFriendWeightLogs(userId);

      expect(mockExec).toHaveBeenCalled();
      expect(mockGetWeightLog).toHaveBeenCalled();

      // expect(User.findOne).toBeCalled();
      // expect(result).toEqual([
      //   {
      //     friend_id: "friend1",
      //     friend_name: "Hello",
      //     weight_log: friend1Log,
      //   },
      //   {
      //     friend_id: "friend2",
      //     friend_name: "Hello",
      //     weight_log: friend2Log,
      //   },
      // ]);
    });
  });
});
