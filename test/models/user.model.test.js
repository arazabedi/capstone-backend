import { describe, it, expect } from "vitest";
import User from "../../src/models/user.model.js";

describe("User model tests", () => {
  it("should create a new user with provided details", () => {
    const userDetails = {
      username: "malcolmstrong",
      full_name: {
        first_name: "Malcolm",
        middle_name: "",
        last_name: "Strong",
      },
      email: "malcolmstrong@hotmail.com",
      password: "123456",
    };

    const user = new User(userDetails);

    expect(user.username).toBe("malcolmstrong");
    expect(user.email).toBe("malcolmstrong@hotmail.com");
    expect(user.password).toBe("123456");
    expect(user.full_name).toStrictEqual({
      first_name: "Malcolm",
      middle_name: "",
      last_name: "Strong",
    });
  });
});
