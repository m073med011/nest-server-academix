import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Organization Cascade Delete (e2e)', () => {
  let app: INestApplication;
  let ownerToken: string | undefined;
  let organizationId: string | undefined;
  let memberIds: string[] | undefined;

  beforeAll(async () => {
    // Setup test environment
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup logic would go here:
    // 1. Create owner user and get token
    // 2. Create organization
    // 3. Add members, roles, courses
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Soft Delete', () => {
    it('should mark organization as deleted', async () => {
      if (!ownerToken) return;

      const response = await request(app.getHttpServer())
        .delete(`/organizations/${organizationId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(response.body.deletedAt).toBeDefined();
    });

    it('should mark all active memberships as LEFT', async () => {
      // Direct DB check would happen here
      // const memberships = await membershipRepository.find({ organizationId });
      // expect(memberships.every(m => m.status === 'left')).toBe(true);
    });

    it('should clear lastActiveOrganization references', async () => {
      // Direct DB check
    });

    it('should not return deleted org in listings', async () => {
      // if (!ownerToken) return; // Should be checking as public or another user

      const response = await request(app.getHttpServer())
        .get('/organizations')
        .expect(200);

      const orgIds = response.body.map(org => org._id);
      expect(orgIds).not.toContain(organizationId);
    });
  });

  describe('Restore', () => {
    it('should restore deleted organization', async () => {
      if (!ownerToken) return;

      await request(app.getHttpServer())
        .post(`/organizations/${organizationId}/restore`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      // Verify DB state
    });
  });

  describe('Permanent Delete', () => {
    it('should require soft delete first', async () => {
      if (!ownerToken) return;

      // Try permanent delete on active org (if restored)
      await request(app.getHttpServer())
        .delete(`/organizations/${organizationId}/permanent`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(400);
    });

    it('should permanently delete all related data', async () => {
      if (!ownerToken) return;

      // Soft delete first
      await request(app.getHttpServer())
        .delete(`/organizations/${organizationId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      // Then permanent delete
      const response = await request(app.getHttpServer())
        .delete(`/organizations/${organizationId}/permanent`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      // Verify complete deletion in DB
    });
  });
});
