

require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const http = require('http');
const app = require('../app');

jest.setTimeout(30000); // Increase Jest timeout to 30s

let server;
let dreamId;

beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    // Connect to a real MongoDB (local or cloud)
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://vikash29raj:mongodb@cluster0.iga7u.mongodb.net/dreams?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(resolve)); // Ensure server is ready
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    if (server) {
        server.close();
    }
});

afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.dropDatabase();
    }
});

beforeEach(async () => {
    const res = await request(server).post('/dreams').send({
        dreamer: 'Alice',
        description: 'I was flying above the clouds.',
        themes: ['Flying', 'Freedom'],
        lucid: true,
        rating: 4
    });
    dreamId = res.body._id;
});

describe('Dream Journal API', () => {
    test('Create a new dream', async () => {
        const res = await request(server)
            .post('/dreams')
            .send({
                dreamer: 'Vikash',
                description: 'I am a good human.',
                themes: ['Water', 'Freedom'],
                lucid: true,
                rating: 3
            });

        expect(res.status).toBe(201);
        expect(res.body.dreamer).toBe('Vikash');
        expect(res.body.themes).toContain('Water');
    });

    test('Get all dreams', async () => {
        const res = await request(server).get('/dreams');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
    });

    test('Get a dream by ID', async () => {
        const res = await request(server).get(`/dreams/${dreamId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(dreamId);
        expect(res.body.dreamer).toBe('Alice');
    });

    test('Update a dream', async () => {
        const res = await request(server)
            .put(`/dreams/${dreamId}`)
            .send({ rating: 5 });
        expect(res.status).toBe(200);
        expect(res.body.rating).toBe(5);
    });

    test('Delete a dream', async () => {
        const res = await request(server).delete(`/dreams/${dreamId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Dream released from the archives.');

        // Confirm it's deleted
        const checkRes = await request(server).get(`/dreams/${dreamId}`);
        expect(checkRes.status).toBe(404);
    });

    test('Analyze a dream', async () => {
        const res = await request(server).put(`/dreams/${dreamId}/analyze`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Analysis complete!');
        expect(res.body.newRating).toBeGreaterThanOrEqual(1);
        expect(res.body.newRating).toBeLessThanOrEqual(5);
    });

    test('Find dreams by theme', async () => {
        // Create another dream with a unique theme
        await request(server).post('/dreams').send({
            dreamer: 'Charlie',
            description: 'I was running through a forest.',
            themes: ['Forest', 'Running'],
            lucid: true,
            rating: 4
        });

        const res = await request(server).get('/dreams/theme/find?theme=Forest');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].themes).toContain('Forest');
    });
});
