const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../server')
const User = require('../models/User')
const Workspace = require('../models/Workspace')
const Project = require('../models/Project')
const TeamMember = require('../models/TeamMember')

const TEST_DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saasly_test'

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB_URI, { serverSelectionTimeoutMS: 5000 })
  }
})

afterAll(async () => {
  // Clean up test database
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
    }
  } catch (e) {
    console.error('Error in afterAll teardown:', e)
  }
})

describe('SaaSly Security, Authentication & Multi-Tenant Test Suite', () => {
  const userA = {
    name: 'Alice Founder',
    email: 'alice@testcompany.com',
    password: 'password123',
  }

  const userB = {
    name: 'Bob Competitor',
    email: 'bob@othercompany.com',
    password: 'password456',
  }

  let tokenA = ''
  let tokenB = ''
  let projectAId = ''
  let teamMemberAId = ''

  // 1. Healthcheck
  test('GET /api/health should return online status and database state', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('online')
    expect(res.body.app).toBe('SaaSly API Engine')
    expect(res.body.database).toBe('MongoDB Connected')
  })

  // 2. Registration Validation
  test('POST /api/auth/register rejects missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'bad@email.com' })
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/required/i)
  })

  test('POST /api/auth/register rejects invalid email format', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'not-an-email',
      password: 'validpassword123',
    })
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/valid email/i)
  })

  test('POST /api/auth/register rejects password under 6 characters', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'shortpass@example.com',
      password: '123',
    })
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/at least 6 characters/i)
  })

  test('POST /api/auth/register successfully registers User A and provisions workspace', async () => {
    const res = await request(app).post('/api/auth/register').send(userA)
    expect(res.status).toBe(201)
    expect(res.body.user).toBeDefined()
    expect(res.body.user.email).toBe(userA.email)
    expect(res.body.user.role).toBe('Owner')
    expect(res.body.user.password).toBeUndefined()
    expect(res.body.token).toBeDefined()
    tokenA = res.body.token
  })

  test('POST /api/auth/register rejects duplicate email registration', async () => {
    const res = await request(app).post('/api/auth/register').send(userA)
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/already exists/i)
  })

  // 3. Login Validation
  test('POST /api/auth/login rejects unregistered email with 401 Unauthorized', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent_user_9999@example.com',
      password: 'randompassword123',
    })
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/invalid email or password/i)
  })

  test('POST /api/auth/login rejects incorrect password with 401 Unauthorized', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: userA.email,
      password: 'wrongpassword',
    })
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/invalid email or password/i)
  })

  test('POST /api/auth/login succeeds with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: userA.email,
      password: userA.password,
    })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe(userA.email)
    expect(res.body.user.password).toBeUndefined()
  })

  // 4. Token & Backdoor Protection
  test('Static fake demo token backdoor is REJECTED', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', 'Bearer demo_jwt_token_saasly')
    expect(res.status).toBe(403)
  })

  test('Protected routes reject requests without Authorization header', async () => {
    const res = await request(app).get('/api/projects')
    expect(res.status).toBe(401)
  })

  test('Protected routes reject invalid or forged JWT tokens', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload')
    expect(res.status).toBe(403)
  })

  // 5. Multi-Tenant User Isolation
  test('Register User B for cross-tenant isolation testing', async () => {
    const res = await request(app).post('/api/auth/register').send(userB)
    expect(res.status).toBe(201)
    tokenB = res.body.token
  })

  test('User A creates a private project in User A workspace', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: "User A Confidential Roadmap",
        description: "Strictly secret initiative for User A",
        budget: "$50,000",
        progress: 10,
        status: "In Progress",
      })
    expect(res.status).toBe(201)
    expect(res.body.project.name).toBe("User A Confidential Roadmap")
    projectAId = res.body.project.id
  })

  test('User B CANNOT see User A private project', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${tokenB}`)
    expect(res.status).toBe(200)
    const projectNames = res.body.projects.map((p) => p.name)
    expect(projectNames).not.toContain("User A Confidential Roadmap")
  })

  test('User B CANNOT update User A project by ID (cross-tenant tampering)', async () => {
    const res = await request(app)
      .put(`/api/projects/${projectAId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: "Hacked by User B" })
    expect(res.status).toBe(404)
  })

  test('User B CANNOT delete User A project by ID', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectAId}`)
      .set('Authorization', `Bearer ${tokenB}`)
    expect(res.status).toBe(404)
  })

  // 6. Team Management & RBAC
  test('User A (Owner) invites a new team member with Member role', async () => {
    const res = await request(app)
      .post('/api/teams/invite')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'Charlie Developer',
        email: 'charlie@testcompany.com',
        role: 'Member',
      })
    expect(res.status).toBe(201)
    expect(res.body.member.email).toBe('charlie@testcompany.com')
    expect(res.body.member.role).toBe('Member')
    teamMemberAId = res.body.member.id
  })

  test('User A cannot remove workspace Owner', async () => {
    const membersRes = await request(app)
      .get('/api/teams')
      .set('Authorization', `Bearer ${tokenA}`)
    const ownerMember = membersRes.body.members.find((m) => m.role === 'Owner')
    expect(ownerMember).toBeDefined()

    const deleteRes = await request(app)
      .delete(`/api/teams/${ownerMember.id}`)
      .set('Authorization', `Bearer ${tokenA}`)
    expect(deleteRes.status).toBe(400)
    expect(deleteRes.body.message).toMatch(/cannot remove workspace owner/i)
  })

  test('User A can update team member role', async () => {
    const res = await request(app)
      .patch(`/api/teams/${teamMemberAId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ role: 'Admin' })
    expect(res.status).toBe(200)
    expect(res.body.member.role).toBe('Admin')
  })

  // 7. Analytics Calculation from Real Entities
  test('GET /api/analytics/stats returns accurate workspace calculations', async () => {
    const res = await request(app)
      .get('/api/analytics/stats')
      .set('Authorization', `Bearer ${tokenA}`)
    expect(res.status).toBe(200)
    expect(res.body.stats).toBeDefined()
    expect(res.body.summary).toBeDefined()
    expect(res.body.summary.totalProjects).toBeGreaterThanOrEqual(1)
    expect(res.body.summary.totalBudget).toBeGreaterThanOrEqual(50000)
  })

  // 8. Profile Update & Password Change
  test('PUT /api/auth/profile updates profile and persists', async () => {
    const res = await request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'Alice Executive',
        bio: 'Chief Executive Officer',
        company: 'Unicorn Tech Inc.',
      })
    expect(res.status).toBe(200)
    expect(res.body.user.name).toBe('Alice Executive')
    expect(res.body.user.bio).toBe('Chief Executive Officer')

    // Verify persistence via /me
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tokenA}`)
    expect(meRes.body.user.name).toBe('Alice Executive')
  })

  test('PUT /api/auth/change-password validates current password and updates hash', async () => {
    // Attempt with incorrect current password
    const failRes = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        currentPassword: 'wrongpassword',
        newPassword: 'newsecurepassword789',
      })
    expect(failRes.status).toBe(401)

    // Attempt with correct current password
    const okRes = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        currentPassword: userA.password,
        newPassword: 'newsecurepassword789',
      })
    expect(okRes.status).toBe(200)

    // Verify login with new password
    const loginRes = await request(app).post('/api/auth/login').send({
      email: userA.email,
      password: 'newsecurepassword789',
    })
    expect(loginRes.status).toBe(200)
  })

  // 9. Controlled Demo Login in Development
  test('POST /api/auth/demo-login works in development with dedicated seeded demo user', async () => {
    const res = await request(app).post('/api/auth/demo-login')
    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe('alex@example.com')
    expect(res.body.token).toBeDefined()
  })
})

