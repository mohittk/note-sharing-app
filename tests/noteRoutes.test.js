const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');
const Note = require('../models/Note');
const jwt = require('jsonwebtoken');
const config = require('../config');



beforeAll(async () => {
    await mongoose.connect(config.mongo_uri);
});

afterAll(async () => {
    await Note.deleteMany({ isTestData: true });
    await mongoose.connection.close();
});

describe('Note Routes', () => {
    let authToken, randomUser, sampleNote, newNote;

    beforeAll(async () => {
        const res = await request(app).get('/api/getRandomUser');
        authToken = res.body.token;
        
        const decodedToken = jwt.decode(authToken);
        randomUser = await User.findOne({_id: decodedToken.userId});

        sampleNote = new Note({
            title: 'Sample Note',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: randomUser._id,
            isTestData: true
        });
        await sampleNote.save();
    })

    it('should get all notes', async() => {
        const res = await request(app)
            .get('/api/notes')
            .set('Authorization', `Bearer ${authToken}`);
        
        
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
    })

    it('should create a new note', async () => {
        const newNote = {
            title: 'New Note',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            isTestData: true
        };

        // //console.log(newNote, '$$$$$$$$');

        const res = await request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newNote);

        // //console.log(res.body, '###################33');

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Note created successfully');
    });

    it('should search notes', async () => {
        const query = 'Sample';

        const res = await request(app)
            .get(`/api/notes/search?q=${query}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
    });

    it('should get a specific note by ID', async () => {
        const res = await request(app)
            .get(`/api/notes/${sampleNote._id}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Sample Note');
        expect(res.body.content).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    });

    it('should update a specific note by ID', async () => {
        const updatedNote = {
            title: 'Updated Sample Note',
            content: 'Updated content for the sample note.',
        };

        const res = await request(app)
            .put(`/api/notes/${sampleNote._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedNote);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Note updated successfully');
    });

    it('should share a specific note by ID', async () => {
        const randomUserRes = await request(app).get('/api/getRandomUser');
        const sharingUserId = randomUserRes.body.userId;

        //console.log(sampleNote._id, '$$#####');

        const res = await request(app)
            .post(`/api/notes/${sampleNote._id}/share`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ userId: sharingUserId });
        
        //console.log(res.body, '$$$$$$$$$$')

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Note shared successfully');
    });


    it('should delete a specific note by ID', async () => {
        const res = await request(app)
            .delete(`/api/notes/${sampleNote._id}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Note deleted successfully');
    });

    


})

