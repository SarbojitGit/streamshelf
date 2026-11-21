import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;
  const users = { findByEmail: jest.fn(), create: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret' })],
      providers: [AuthService, { provide: UsersService, useValue: users }],
    }).compile();

    service = moduleRef.get(AuthService);
    jwt = moduleRef.get(JwtService);
  });

  it('registers a new user, hashes the password and returns a token', async () => {
    users.findByEmail.mockResolvedValue(null);
    users.create.mockImplementation((email: string, passwordHash: string) =>
      Promise.resolve({ id: 'u1', email, role: 'user', passwordHash }),
    );

    const result = await service.register('new@example.com', 'password123');

    const storedHash = users.create.mock.calls[0][1];
    expect(storedHash).not.toBe('password123');
    expect(await bcrypt.compare('password123', storedHash)).toBe(true);

    const payload = jwt.verify(result.accessToken);
    expect(payload.sub).toBe('u1');
    expect(payload.role).toBe('user');
  });

  it('rejects registration when the email already exists', async () => {
    users.findByEmail.mockResolvedValue({ id: 'u1' });

    await expect(
      service.register('taken@example.com', 'password123'),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(users.create).not.toHaveBeenCalled();
  });

  it('logs in with the correct password', async () => {
    const passwordHash = await bcrypt.hash('password123', 4);
    users.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'a@example.com',
      role: 'admin',
      passwordHash,
    });

    const result = await service.login('a@example.com', 'password123');

    expect(jwt.verify(result.accessToken).role).toBe('admin');
  });

  it('rejects a wrong password', async () => {
    const passwordHash = await bcrypt.hash('password123', 4);
    users.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'a@example.com',
      role: 'user',
      passwordHash,
    });

    await expect(
      service.login('a@example.com', 'wrong-password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an unknown email', async () => {
    users.findByEmail.mockResolvedValue(null);

    await expect(
      service.login('nobody@example.com', 'password123'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});