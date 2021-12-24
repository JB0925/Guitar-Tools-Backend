process.env.NODE_ENV = "test";
const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");


// tests for the User model in models/user.js
describe("testing the User class and User CRUD methods", () => {
  let testUser;
  let testUserWithoutHashedPassword;
  let newUser;
  
  beforeEach(async() => {
    const password = "cookies";
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
  
    await db.query("DELETE FROM users");
    let user = await db.query(
      `INSERT INTO users
      (username, password, high_score)
      VALUES
      ($1, $2, $3)
      RETURNING id, username, password high_score`,
      ["testUser", hashedPassword, 10]
    );
      
    testUser = user.rows[0];
    testUserWithoutHashedPassword = { username: "testUser", password: "cookies" };
    newUser = { username: "test", password: "cookies" };
  });
      
  afterEach(async() => {
    await db.query("DELETE FROM users");
  });
      
  afterAll(async() => {
    await db.end();
  });


  it("creates a user", async() => {
    let userData = { username: "newUser", password: "password" };
    let newUser = await User.register(userData);
    expect(newUser.id).not.toBeNull();
    expect(newUser.password).not.toEqual("password");
  });

  it("will not create a user if the username is taken", async() => {
    try {
        // this should NOT work
        await User.register(testUserWithoutHashedPassword);
    } catch (error) {
        // this is the expectation in this case
        expect(error.message).toEqual("This username is taken");
    };
  });

  it("will login an existing user", async() => {
    let loggedInUser = await User.authenticate(testUserWithoutHashedPassword);
    expect(loggedInUser.id).not.toBeNull();
    expect(loggedInUser.password).toBe(undefined);
  });

  it("will NOT login a user who is not registered", async() => {
    try {
        // this should not work
        await User.authenticate(newUser);
    } catch (error) {
        // again, this is expected with the given data
        expect(error.message).toEqual("Invalid username / password");
    };
  });

  it("will retrieve a user's high score for the Flashcard game", async() => {
    const highScore = await User.getHighScore(testUser.id);
    expect(highScore).toBe(10);
  });

  it("will return an error message for a nonexistant user", async() => {
    try {
      // this should not happen
      await User.getHighScore(654321);
    } catch (error) {
      // the expected case
      expect(error.message).toEqual("No user with this id");
    };
  });

  it("will set a user's high score for the Flashcard game, given a valid id", async() => {
    await User.setHighScore(testUser.id, 12);
    const newHighScore = await User.getHighScore(testUser.id);
    expect(newHighScore).toBe(12);
  });

  it("will throw an error if the user does not exist", async() => {
    try {
      // this should not work in this case
      await User.setHighScore(testUser.id, 12);
    } catch (error) {
      expect(error.message).toEqual("No user with this id");
    };
  });
});