const request = require('supertest');
const app = require('../src/app');
const userService = require('../src/services/user.service');

describe('User API', () => {
  beforeEach(() => {
    userService.resetUsersForTests();
    process.env.API_KEY = 'test-only-api-key';
  });

  afterAll(() => delete process.env.API_KEY);

  it('lists users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });

  it('returns a user by ID', async () => {
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('asha@example.com');
  });

  it('returns 404 for an unknown user', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
  });

  it('validates user input', async () => {
    const response = await request(app).post('/api/users')
      .set('x-api-key', 'test-only-api-key')
      .send({ name: 'A', email: 'not-an-email' });
    expect(response.status).toBe(400);
  });

  it('requires an API key to create a user', async () => {
    const response = await request(app).post('/api/users')
      .send({ name: 'Meera Singh', email: 'meera@example.com' });
    expect(response.status).toBe(401);
  });

  it('creates a user with a valid API key', async () => {
    const response = await request(app).post('/api/users')
      .set('x-api-key', 'test-only-api-key')
      .send({ name: 'Meera Singh', email: 'MEERA@example.com' });
    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe('meera@example.com');
  });
});
