import request from "supertest"
import app from "../app.js"

describe("ROOT", () => {
    describe("get respond from server", () => {
        // should get respond from server
        test("should respond with 200 status code", async () => {
            const response = await request(app)
            .get('/')
            .set('Content-Type', 'application/json')
            expect(response.headers["Content-Type"]).toMatch(/json/);
            expect(response.status).toEqual(200);
            expect(response.body)
        })
        test("should respond with have message", async () => {
            const response = await request(app).get('/')
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("USER", () => {
    describe("get respond from server", () => {
        // should get respond from server
        test("should respond with 200 status code", async () => {
            const response = await request(app).get('/')
            expect(response.statusCode).toBe(200)
        })
    })
})