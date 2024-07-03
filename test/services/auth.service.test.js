import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import {
  register,
  login,
  logout,
  changePassword,
} from "../../src/services/auth.service";
import User from "../../src/models/user.model";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted, addToBlacklist } from "../../src/middleware/redis";

describe("Auth service tests", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  beforeEach(() => {});

  vi.mock("./../../src/models/user.model.js", () => ({
    default: vi.fn(function (userData) {
      this.username = userData.username;
      this.email = userData.email;
      this.full_name = userData.full_name;
      this.password = userData.password;
      this.friends = [];
      this.weight_log = [];
      this.save = vi.fn();
    }),
  }));

  describe("register", () => {
    it("should create a new user and save it to the database", async () => {
      const userData = {
        username: "jamesmay",
        email: "jamesmay@hotmail.com",
        full_name: {
          first_name: "James",
          middle_name: "Marvin",
          last_name: "May",
        },
        password: "123456",
      };

      const user = await register(userData);
      expect(User).toHaveBeenCalled();
      expect(user.save).toHaveBeenCalled();
      expect(user.username).toStrictEqual("jamesmay");
    });
    it("should throw an error if no user data is given", async () => {
      await expect(register()).rejects.toThrowError();
    });
  });

  describe("login", () => {
    it("should return an object with user details given valid username and password", async () => {
      User.findOne = vi.fn();
      const mockId = new mongoose.Types.ObjectId();
      const mockUser = {
        _id: mockId,
        username: "jamesmay",
        full_name: {
          first_name: "James",
          middle_name: "Marvin",
          last_name: "May",
        },
        email: "jamesmay@hotmail.com",
        password: "123456",
      };
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });
      bcrypt.compareSync = vi.fn(() => true);
      jwt.sign = vi.fn(() => "mockAccessToken");
      const userInfo = await login("jamesmay", "123456");
      expect(userInfo).toStrictEqual({
        accessToken: "mockAccessToken",
        email: "jamesmay@hotmail.com",
        full_name: {
          first_name: "James",
          last_name: "May",
          middle_name: "Marvin",
        },
        id: mockId,
        username: "jamesmay",
      });
    });
    it("should throw an error if the user is not found", async () => {
      User.findOne = vi.fn();
      const mockExec = vi.fn().mockResolvedValue(null);
      User.findOne.mockReturnValue({ exec: mockExec });
      const username = "jamesmay";
      const password = "123456";
      await expect(() => login(username, password)).rejects.toThrowError();
    });
    it("should throw an error if the user/password combination is incorrect", async () => {
      User.findOne = vi.fn();
      const mockId = new mongoose.Types.ObjectId();
      const mockUser = {
        _id: mockId,
        username: "jamesmay",
        full_name: {
          first_name: "James",
          middle_name: "Marvin",
          last_name: "May",
        },
        email: "jamesmay@hotmail.com",
        password: "123456",
      };
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });
      bcrypt.compareSync = vi.fn(() => false);
      const username = "jamesmay";
      const password = "78910";
      await expect(() => login(username, password)).rejects.toThrowError();
    });
  });

  describe("logout", () => {
    vi.mock("../../src/middleware/redis", () => ({
      isTokenBlacklisted: vi.fn(() => false),
      addToBlacklist: vi.fn(() => true),
    }));
    it("should return a message object when user is successfully logged out", async () => {
      const mockToken = "abcdefg";
      const response = await logout(mockToken);
      expect(isTokenBlacklisted).toHaveBeenCalled();
      expect(addToBlacklist).toHaveBeenCalled();
      expect(response.message).toStrictEqual("User successfully logged out");
    });
    it("should throw an error if the token is already blacklisted", async () => {
      isTokenBlacklisted = vi.fn(() => true);
      const mockToken = "abcdefg";
      await expect(() => logout(mockToken)).rejects.toThrowError();
    });
    it("should throw an error on a failed addToBlacklist call", async () => {
      addToBlacklist = vi.fn(() =>
        Promise.reject(new Error("Failed to add token to blacklist"))
      );
      const mockToken = "abcdefg";
      await expect(() => logout(mockToken)).rejects.toThrowError();
    });
  });
  describe("changePassword", async () => {
    it("should return a success message on successfully changing password", async () => {
      const mockUser = { save: vi.fn() };
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });
      bcrypt.compareSync = vi.fn(() => true);
      bcrypt.hash(() => Promise.resolve(() => true));

      const username = "jamesmay";
      const oldPassword = "123456";
      const newPassword = "78910";
      const response = await changePassword(username, oldPassword, newPassword);
      expect(response.message).toStrictEqual("Successfully changed password");
    });
    it("should throw an error if user is not found", async () => {
      const mockExec = vi.fn().mockResolvedValue(null);
      User.findOne.mockReturnValue({ exec: mockExec });
      await expect(() => changePassword()).rejects.toThrowError();
    });
    it("should throw an error if the password is invalid", async () => {
      const mockUser = {};
      const mockExec = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ exec: mockExec });
      bcrypt.compareSync = vi.fn(() => false);
      await expect(() => changePassword()).rejects.toThrowError();
    });
  });
});
