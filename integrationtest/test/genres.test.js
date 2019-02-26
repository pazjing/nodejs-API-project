const request = require('supertest');
const app = require('../app');
const mongoDB = require('../db');

describe('Test the genre path', () => {

    beforeAll(() => {
        mongoDB.connect();
    });
    afterAll((done) => {
        mongoDB.disconnect(done);
    });

    test('Get /', async () => {
        const response = await request(app).get('/api/genres');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(4);
    });
});