import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController (HTTP)', () => {
  let app: INestApplication;
  const users = { findByEmail: jest.fn(), create: jest.fn() };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret' })],
      controllers: [AuthController],
      providers: [AuthService, { provide: UsersService, useValue: users }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('POST /auth/register rejects a short password with 400', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'a@example.com', password: '123' })
      .expect(400);
  });

  it('POST /auth/register rejects an invalid email with 400', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'not-an-email', password: 'password123' })
      .expect(400);
  });

  it('POST /auth/register returns a token for valid input', async () => {
    users.findByEmail.mockResolvedValue(null);
    users.create.mockResolvedValue({
      id: 'u1',
      email: 'new@example.com',
      role: 'user',
    });

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'new@example.com', password: 'password123' })
      .expect(201);

    expect(res.body.accessToken).toEqual(expect.any(String));
  });

  it('POST /auth/login returns 401 for an unknown user', async () => {
    users.findByEmail.mockResolvedValue(null);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' })
      .expect(401);
  });

  it('POST /auth/login returns 200 and a token for valid credentials', async () => {
    const passwordHash = await bcrypt.hash('password123', 4);
    users.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'a@example.com',
      role: 'user',
      passwordHash,
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'a@example.com', password: 'password123' })
      .expect(200);

    expect(res.body.accessToken).toEqual(expect.any(String));
  });
});