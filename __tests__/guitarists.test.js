process.env.NODE_ENV = "test";
const app = require("../app");
const db = require("../db");
const request = require("supertest");
const nock = require("nock");

beforeEach(async() => {
  await db.query("DELETE FROM users");
});

afterEach(async() => {
  nock.cleanAll();
  await db.query("DELETE FROM users");
});

afterAll(async() => {
  nock.restore();
  await db.end();
});

describe("testing HTTP requests to the audiodb API", () => {
  it("will successfully handle a request with a valid guitarist name", async() => {
    nock('https://theaudiodb.p.rapidapi.com/', { allowUnmocked: true })
    .persist()
    .get('/search.php/jimi hendrix')
    .reply(200, {
      artists: [{ intBornYear: 1942, intDiedYear: 1970, strGenre: "Rock",
            strBiographyEN: "hello", strArtistThumb: ""
      }]
    });

    const response = await request(app).get("/guitarist/" + "jimi hendrix");
    expect(response.statusCode).toBe(200);
    expect(response.body.birthYear).toBe("1942");
    expect(response.body.genre).toBe("Rock");
  });

  it("will successfully handle a request with a valid guitarist name", async() => {
    nock('https://theaudiodb.p.rapidapi.com/', { allowUnmocked: true })
    .persist()
    .get('/search.php/booboochicken')
    .reply(400, {
         message: "Sorry, we could not find this musician.", status: 400
      }
    );

    const response = await request(app).get("/guitarist/" + "booboochicken");
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toBe("Sorry, we could not find this musician.");
  });
});


