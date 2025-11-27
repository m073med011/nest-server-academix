import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { CoursesRepository } from './courses.repository';
import { PaymentsService } from '../payments/payments.service';
import { NotFoundException } from '@nestjs/common';

describe('CoursesService', () => {
  let service: CoursesService;
  let repository: CoursesRepository;
  let paymentsService: PaymentsService;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPaymentsService = {
    getUserPurchasedCourses: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: CoursesRepository, useValue: mockRepository },
        { provide: PaymentsService, useValue: mockPaymentsService },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    repository = module.get<CoursesRepository>(CoursesRepository);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a course', async () => {
      const createCourseDto = {
        title: 'Test Course',
        description: 'Description',
      };
      const createdCourse = { _id: 'id', ...createCourseDto };
      mockRepository.create.mockResolvedValue(createdCourse);

      const result = await service.create(
        createCourseDto as any,
        'instructorId',
      );
      expect(result).toEqual(createdCourse);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createCourseDto,
        instructor: 'instructorId',
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const courses = [{ title: 'Course 1' }, { title: 'Course 2' }];
      const total = 2;
      mockRepository.findAll.mockResolvedValue(courses);
      mockRepository.count.mockResolvedValue(total);

      const result = await service.findAll({});
      expect(result).toEqual({
        success: true,
        data: courses,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasMore: false,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a course by id', async () => {
      const course = { _id: 'id', title: 'Course 1' };
      mockRepository.findById.mockResolvedValue(course);

      const result = await service.findOne('id');
      expect(result).toEqual(course);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });
});
