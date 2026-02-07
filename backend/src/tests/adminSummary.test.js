const request = require('supertest');
const { app } = require('../index');
const db = require('../config/database');
const { createTestUser } = require('./testHelper');

describe('AI Admin Summary API', () => {
  let adminToken;
  let adminId;
  let researcherToken;
  let researcherId;
  let testProjectId;

  beforeAll(async () => {
    await db.query("DELETE FROM users WHERE email LIKE '%aisummarytest%'");
    const admin = await createTestUser({ name: 'AI Summary Admin', email: 'aisummarytest-admin@example.com', role: 'admin' });
    adminToken = admin.token;
    adminId = admin.id;
    const researcher = await createTestUser({ name: 'AI Summary Researcher', email: 'aisummarytest-researcher@example.com', role: 'researcher' });
    researcherToken = researcher.token;
    researcherId = researcher.id;

    const projectRes = await request(app).post('/api/projects').set('Authorization', `Bearer ${adminToken}`).send({ title: 'AI Summary Test Project', description: 'A project for testing admin AI summary' });
    testProjectId = projectRes.body.project.id;

    await request(app).post(`/api/actions/project/${testProjectId}`).set('Authorization', `Bearer ${adminToken}`).send({ title: 'Completed task', assigned_to: adminId });
    const actionRes = await request(app).post(`/api/actions/project/${testProjectId}`).set('Authorization', `Bearer ${adminToken}`).send({ title: 'Task to complete' });
    if (actionRes.body.action) {
      await request(app).put(`/api/actions/${actionRes.body.action.id}`).set('Authorization', `Bearer ${adminToken}`).send({ completed: true });
    }
    await request(app).post(`/api/actions/project/${testProjectId}`).set('Authorization', `Bearer ${adminToken}`).send({ title: 'Pending task', due_date: '2026-12-31' });
    await request(app).post(`/api/actions/project/${testProjectId}`).set('Authorization', `Bearer ${adminToken}`).send({ title: 'In progress task', assigned_to: researcherId });
  });

  afterAll(async () => {
    await db.query("DELETE FROM action_items WHERE project_id = $1", [testProjectId]);
    await db.query("DELETE FROM projects WHERE id = $1", [testProjectId]);
    await db.query("DELETE FROM users WHERE email LIKE '%aisummarytest%'");
  });

  describe('POST /api/ai/admin-summary', () => {
    it('should reject unauthenticated requests', async () => {
      const res = await request(app).post('/api/ai/admin-summary').send({ dateRange: 'week' });
      expect(res.status).toBe(401);
    });

    it('should reject non-admin users', async () => {
      const res = await request(app).post('/api/ai/admin-summary').set('Authorization', `Bearer ${researcherToken}`).send({ dateRange: 'week' });
      expect(res.status).toBe(403);
    });

    it('should reject invalid dateRange values', async () => {
      const res = await request(app).post('/api/ai/admin-summary').set('Authorization', `Bearer ${adminToken}`).send({ dateRange: 'invalid' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should accept valid dateRange: week', async () => {
      const res = await request(app).post('/api/ai/admin-summary').set('Authorization', `Bearer ${adminToken}`).send({ dateRange: 'week' });
      expect([200, 503]).toContain(res.status);
      if (res.status === 503) { expect(res.body.error.message).toContain('GEMINI_API_KEY'); }
      if (res.status === 200) { expect(res.body).toHaveProperty('summary'); expect(res.body).toHaveProperty('dateRange', 'week'); expect(res.body).toHaveProperty('generatedAt'); }
    });

    it('should accept valid dateRange: month', async () => {
      const res = await request(app).post('/api/ai/admin-summary').set('Authorization', `Bearer ${adminToken}`).send({ dateRange: 'month' });
      expect([200, 503]).toContain(res.status);
    });

    it('should accept valid dateRange: all', async () => {
      const res = await request(app).post('/api/ai/admin-summary').set('Authorization', `Bearer ${adminToken}`).send({ dateRange: 'all' });
      expect([200, 503]).toContain(res.status);
    });

    it('should default to week when no dateRange is provided', async () => {
      const res = await request(app).post('/api/ai/admin-summary').set('Authorization', `Bearer ${adminToken}`).send({});
      expect([200, 503]).toContain(res.status);
      if (res.status === 200) { expect(res.body.dateRange).toBe('week'); }
    });
  });
});
