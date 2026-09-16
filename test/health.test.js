const request = require('supertest');
const express = require('express');
const { healthCheck } = require('../src/routes/health');

// Mock the database pool so we don't need a real DB to test the route
jest.mock('../src/config/db', () => ({
  pool: { query: jest.fn() }
}));
const { pool } = require('../src/config/db');

const app = express();
app.get('/health', healthCheck);

describe('Health Check Route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 and healthy status when DB is reachable', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'healthy', database: 'connected' });
  });

  it('returns 503 and unhealthy status when DB is unreachable', async () => {
    pool.query.mockRejectedValueOnce(new Error('Connection timeout'));
    const res = await request(app).get('/health');
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: 'unhealthy', database: 'disconnected' });
  });
});