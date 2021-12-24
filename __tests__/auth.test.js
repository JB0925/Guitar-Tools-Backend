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


describe("testing the user authentication routes", () => {
  it("will login a registered user", async() => {
    let response = await request(app).post("/auth/login").send(registeredUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.token).not.toBeNull();
    expect(response.body.id).not.toBeNull();
  });

  it("will not login an unregistered user", async() => {
    let response = await request(app).post("/auth/login").send(unregisteredUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toBe("Invalid username / password");
  });

  it("will register a new user", async() => {
    let response = await request(app).post("/auth/signup").send(unregisteredUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.token.indexOf("ey")).toBe(0);
    expect(response.body.id).not.toBeNull();
  });

  it("will not register a user with an already taken username", async() => {
    let response = await request(app).post("/auth/signup").send(registeredUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toBe("This username is taken");
  });

  it("will not allow login without the proper fields being passed", async() => {
    let response = await request(app).post("/auth/login").send(badJSON);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toContain('instance requires property "username"');
  });

  it("will not allow registration without the proper fields being passed", async() => {
    let response = await request(app).post("/auth/signup").send(badJSON);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toContain('instance requires property "username"');
  });
});