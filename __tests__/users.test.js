process.env.NODE_ENV = "test";
const app = require("../app");
const db = require("../db");
const request = require("supertest");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");

let user1;
let registeredUser;
let unregisteredUser;
let badJSON;

beforeEach(async() => {
  await db.query("DELETE FROM users");
  const password = "cookies";
  const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  let query1 = await db.query(
    `INSERT INTO users
     (username, password, high_score)
     VALUES
     ($1, $2, $3)
     RETURNING id, username, password, high_score`,
     ["testUser", hashedPassword, 10]
  );

  user1 = query1.rows[0];
  registeredUser = { username: "testUser", password: "cookies" };
  unregisteredUser = { username: "test", password: "cookies" };
  badJSON = { user: "testUser", pwd: "cookies" };
});

afterEach(async() => {
  await db.query("DELETE FROM users");
});

afterAll(async() => {
    await db.end();
});


describe("retrieving and setting user high scores", () => {
  it("will retrieve an existing user's high score", async() => {
    let response = await request(app).get(`/users/${user1.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.highScore).toBe(10);
  });

  it("will throw an error for a nonexistant user", async() => {
    let response = await request(app).get(`/users/0`);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toBe("No user with this id");
  });

  it("will set an existing user's high score", async() => {
    const newHighScore = { newHighScore: 12 };
    let response = await request(app).post(`/users/${user1.id}`).send(newHighScore);
    expect(response.statusCode).toBe(200);
    expect(response.body.highScore).toBe(12);
  });

  it("will throw an error with a nonexistant user", async() => {
    const newHighScore = { newHighScore: 12 };
    let response = await request(app).post(`/users/0`).send(newHighScore);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toBe("No user with this id");
  });
});