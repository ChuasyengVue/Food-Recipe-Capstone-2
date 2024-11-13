"use strict";

const request = require("supertest");
const app = require("../app"); // Adjust the path as necessary
const db = require("../db");
const User = require("../models/user");

const testUser = {
    username: "testuser",
    password: "password123",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
};

beforeAll(async () => {
    // Clear the users table and add a test user
    await db.query("DELETE FROM users");
    await User.register(testUser);
});

afterAll(async () => {
    // Cleanup: close database connection
    await db.end();
});

describe("User Routes", function () {
    describe("POST /auth/login", function () {
        test("works", async function () {
            const response = await request(app)
                .post("/auth/login")
                .send({
                    username: testUser.username,
                    password: testUser.password,
                });
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("token");
        });

        test("invalid username", async function () {
            const response = await request(app)
                .post("/auth/login")
                .send({
                    username: "invalidUser",
                    password: testUser.password,
                });
            expect(response.statusCode).toBe(401); // Unauthorized
        });

        test("invalid password", async function () {
            const response = await request(app)
                .post("/auth/login")
                .send({
                    username: testUser.username,
                    password: "wrongPassword",
                });
            expect(response.statusCode).toBe(401); // Unauthorized
        });
    });

    describe("POST /auth/signup", function () {
        test("works", async function () {
            const response = await request(app)
                .post("/auth/signup")
                .send({
                    username: "newuser",
                    password: "newpassword",
                    firstName: "New",
                    lastName: "User",
                    email: "new@example.com",
                });
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("token");
        });

        test("duplicate username", async function () {
            const response = await request(app)
                .post("/auth/signup")
                .send(testUser); // Attempt to register the same user
            expect(response.statusCode).toBe(400); // Bad request
        });

        test("missing fields", async function () {
            const response = await request(app)
                .post("/auth/signup")
                .send({
                    username: "incompleteUser", // Missing other required fields
                });
            expect(response.statusCode).toBe(400); // Bad request
        });
    });

    describe("GET /auth/:username", function () {
        test("works", async function () {
            const response = await request(app)
                .get(`/auth/${testUser.username}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("user");
            expect(response.body.user).toHaveProperty("username", testUser.username);
        });

        test("user not found", async function () {
            const response = await request(app)
                .get("/auth/invalidUser");
            expect(response.statusCode).toBe(404); // Not found
        });
    });
});
