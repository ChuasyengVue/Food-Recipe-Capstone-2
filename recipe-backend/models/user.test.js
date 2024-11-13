const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("User model", function () {
    const testUser = {
        username: "testuser",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        isAdmin: false,
    };

    beforeEach(async () => {
        // Clear the users table before each test
        await db.query("DELETE FROM users");
    });

    afterAll(async () => {
        // Cleanup: close database connection
        await db.end();
    });

    describe("register", function () {
        test("works", async function () {
            const user = await User.register(testUser);
            expect(user).toEqual({
                username: testUser.username,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email,
                isAdmin: testUser.isAdmin,
            });

            const result = await db.query(
                `SELECT username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"
                 FROM users
                 WHERE username = $1`,
                [testUser.username]
            );
            expect(result.rows).toEqual([user]);
        });

        test("bad request with duplicate username", async function () {
            await User.register(testUser);
            try {
                await User.register(testUser); // Attempt to register again
                fail("Expected error not thrown");
            } catch (err) {
                expect(err instanceof BadRequestError).toBeTruthy();
                expect(err.message).toEqual(`Duplicate username: ${testUser.username}`);
            }
        });
    });

    describe("authenticate", function () {
        test("works", async function () {
            await User.register(testUser);
            const user = await User.authenticate(testUser.username, testUser.password);
            expect(user).toEqual({
                username: testUser.username,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email,
                isAdmin: testUser.isAdmin,
            });
        });

        test("unauthorized if user not found", async function () {
            try {
                await User.authenticate("nonexistentuser", testUser.password);
                fail("Expected error not thrown");
            } catch (err) {
                expect(err instanceof UnauthorizedError).toBeTruthy();
                expect(err.message).toEqual("Invalid username/passowrd");
            }
        });

        test("unauthorized if wrong password", async function () {
            await User.register(testUser);
            try {
                await User.authenticate(testUser.username, "wrongpassword");
                fail("Expected error not thrown");
            } catch (err) {
                expect(err instanceof UnauthorizedError).toBeTruthy();
                expect(err.message).toEqual("Invalid username/passowrd");
            }
        });
    });

    describe("get", function () {
        test("works", async function () {
            await User.register(testUser);
            const user = await User.get(testUser.username);
            expect(user).toEqual({
                username: testUser.username,
                email: testUser.email,
            });
        });

        test("not found if user does not exist", async function () {
            try {
                await User.get("nonexistentuser");
                fail("Expected error not thrown");
            } catch (err) {
                expect(err.message).toEqual("User not found!");
            }
        });
    });
});