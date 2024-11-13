"use strict";

const request = require("supertest");
const app = require("../app"); // Adjust the path as necessary
const db = require("../db");
const User = require("../models/user");
const { BadRequestError } = require("../expressError");

describe("Authentication Routes", function () {
    const testUser = {
        username: "testuser",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
    };

    beforeEach(async () => {
        // Clear the users table before each test
        await db.query("DELETE FROM users");
    });

    afterAll(async () => {
        // Cleanup: close database connection
        await db.end();
    });

    describe("POST /auth/signup", function () {
        test("works", async function () {
            const response = await request(app)
                .post("/auth/signup")
                .send(testUser);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("token");
        });

        test("bad request with missing fields", async function () {
            const response = await request(app)
                .post("/auth/signup")
                .send({
                    username: testUser.username,
                    password: testUser.password,
                }); // Missing firstName, lastName, and email
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBeInstanceOf(Array); // Assuming errors are returned as an array
        });

        test("bad request with duplicate username", async function () {
            await request(app).post("/auth/signup").send(testUser);
            const response = await request(app).post("/auth/signup").send(testUser);
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toMatch(/Duplicate username:/);
        });
    });

    describe("POST /auth/token", function () {
        beforeEach(async () => {
            // Register the user first for testing token generation
            await User.register(testUser);
        });

        test("works", async function () {
            const response = await request(app)
                .post("/auth/token")
                .send({
                    username: testUser.username,
                    password: testUser.password,
                });
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("token");
        });

        test("unauthorized with wrong password", async function () {
            const response = await request(app)
                .post("/auth/token")
                .send({
                    username: testUser.username,
                    password: "wrongpassword",
                });
            expect(response.statusCode).toBe(401);
            expect(response.body.error).toEqual("Invalid username/passowrd");
        });

        test("unauthorized with non-existent user", async function () {
            const response = await request(app)
                .post("/auth/token")
                .send({
                    username: "nonexistentuser",
                    password: testUser.password,
                });
            expect(response.statusCode).toBe(401);
            expect(response.body.error).toEqual("Invalid username/passowrd");
        });

        test("bad request with missing fields", async function () {
            const response = await request(app)
                .post("/auth/token")
                .send({
                    username: testUser.username,
                }); // Missing password
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBeInstanceOf(Array); // Assuming errors are returned as an array
        });
    });
});
