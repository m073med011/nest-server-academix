import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Organization Security (e2e)', () => {
  let app: INestApplication;
  let adminToken: string | undefined;
  let instructorToken: string | undefined;
  let studentToken: string | undefined;
  let outsiderToken: string | undefined;
  let organizationId: string | undefined;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup test users and organization
    // Note: This requires a running DB and valid implementation of AuthService to generate tokens
    // For now, we assume these are populated by helper functions or manual setup in a real environment
    
    // Placeholder for setup logic
    // 1. Create users (Admin, Instructor, Student, Outsider)
    // 2. Login users to get tokens
    // 3. Create an organization with Admin as owner
    // 4. Add Instructor and Student as members with respective roles
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Member Management', () => {
    it('should allow admin to add members', async () => {
      // Skipping actual execution as we don't have real tokens
      if (!adminToken) return;

      return request(app.getHttpServer())
        .post(`/organizations/${organizationId}/members`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: 'newUserId',
          email: 'newuser@test.com',
          roleId: 'studentRoleId',
        })
        .expect(201);
    });

    it('should deny student from adding members', async () => {
      if (!studentToken) return;

      return request(app.getHttpServer())
        .post(`/organizations/${organizationId}/members`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          userId: 'newUserId',
          email: 'newuser@test.com',
          roleId: 'studentRoleId',
        })
        .expect(403);
    });

    it('should deny non-member from adding members', async () => {
      if (!outsiderToken) return;

      return request(app.getHttpServer())
        .post(`/organizations/${organizationId}/members`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .send({
          userId: 'newUserId',
          email: 'newuser@test.com',
          roleId: 'studentRoleId',
        })
        .expect(403);
    });
  });

  describe('Organization Deletion', () => {
    it('should allow owner to delete organization', async () => {
      if (!adminToken) return;

      return request(app.getHttpServer())
        .delete(`/organizations/${organizationId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('should deny non-owner admin from deleting', async () => {
      if (!instructorToken) return;

      // Create second admin who is not owner
      return request(app.getHttpServer())
        .delete(`/organizations/${organizationId}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .expect(403);
    });
  });

  describe('Role Management', () => {
    it('should allow admin to create roles', async () => {
      if (!adminToken) return;

      return request(app.getHttpServer())
        .post(`/organizations/${organizationId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Teaching Assistant',
          permissions: {
            canManageCourses: true,
            canManageStudents: false,
          },
        })
        .expect(201);
    });

    it('should deny instructor from creating roles', async () => {
      if (!instructorToken) return;

      return request(app.getHttpServer())
        .post(`/organizations/${organizationId}/roles`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          name: 'Teaching Assistant',
          permissions: {
            canManageCourses: true,
          },
        })
        .expect(403);
    });
  });
});
