const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
require("dotenv").config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});



describe('Auth Routes', () => {
    it("should register a new user", async () => {
        const userPayload = {
            username: "testuser",
            email: "testuser@gmail.com",
            password: "testpassword",
        }

        const res = await request(app)
            .post('/api/auth/signup')
            .send(userPayload)
            .set("Content-Type", "application/json")

        // console.log('Response:', res.body);

        expect(res.statusCode).toBe(201);
    });

    it("should authenticate a user", async () => {
        const userCredentials = {
            username: "testuser", 
            password: "testpassword"
        }

        const res = await request(app)
            .post('/api/auth/login')
            .send(userCredentials)
            .set("Content-Type", "application/json")

        expect(res.statusCode).toBe(200);
    })

})

afterAll(async () => {
    await mongoose.connection.db.collection('users').deleteOne({username: 'testuser'})
    await mongoose.connection.close();
});




