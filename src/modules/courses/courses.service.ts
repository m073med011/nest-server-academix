import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CoursesRepository } from './courses.repository';
import { PaymentsService } from '../payments/payments.service';
import { CourseDocument } from './schemas/course.schema';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CourseFilterDto,
  CourseType,
  EnrollmentType,
} from './dto/courses.dto';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(createCourseDto: CreateCourseDto, instructorId: string) {
    const courseData = { ...createCourseDto, instructor: instructorId };

    // Set defaults for ORGANIZATION course type
    if (courseData.courseType === CourseType.ORGANIZATION) {
      courseData.enrollmentType = EnrollmentType.ORG_SUBSCRIPTION;
      courseData.isOrgPrivate = true;
      courseData.hasAccessRestrictions = false;
      courseData.price = 0;
      courseData.enrollmentCap = 0;
    }

    return this.coursesRepository.create(courseData);
  }

  async findAll(filterDto: CourseFilterDto) {
    // Extract pagination parameters with dynamic defaults
    const page = filterDto.page || '1';
    const limit = filterDto.limit || '10';
    const { category, level, search, sort } = filterDto;

    const filter: FilterQuery<CourseDocument> = {
      isPublished: true,
      $or: [
        { isOrgPrivate: false },
        { isOrgPrivate: { $exists: false } },
        { organizationId: { $exists: false } },
      ],
    };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$text = { $search: search };
    }

    type SortOption = { [key: string]: 1 | -1 };
    let sortOption: SortOption = { createdAt: -1 }; // Default: newest

    if (sort) {
      switch (sort) {
        case 'popular':
          sortOption = { students: -1 }; // Approximation for popularity
          break;
        case 'rated':
          sortOption = { rating: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    const options = {
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      sort: sortOption,
    };

    const courses = await this.coursesRepository.findAll(filter, options);
    const total = await this.coursesRepository.count(filter);

    return {
      success: true,
      data: courses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        hasMore: Number(page) * Number(limit) < total,
      },
    };
  }

  async findOne(id: string) {
    const course = await this.coursesRepository.findById(id, {
      populate: [
        { path: 'instructor', select: 'name email imageProfileUrl' },
        { path: 'modules.items.materialId' },
      ],
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.coursesRepository.update(id, updateCourseDto);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async remove(id: string) {
    const course = await this.coursesRepository.delete(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return { message: 'Course deleted successfully' };
  }

  async enroll(courseId: string, userId: string) {
    const course = await this.coursesRepository.addStudent(courseId, userId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    // TODO: Implement payment logic here if needed, or assume free enrollment for now
    return { message: 'Successfully enrolled in course', data: course };
  }

  async unenroll(courseId: string, userId: string) {
    const course = await this.coursesRepository.removeStudent(courseId, userId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return { message: 'Successfully unenrolled from course', data: course };
  }

  async getUserPurchasedCourses(userId: string) {
    const courses = await this.paymentsService.getUserPurchasedCourses(userId);
    return {
      success: true,
      data: courses,
      totalCount: courses.length,
    };
  }

  async addEditor(courseId: string, editorId: string) {
    const course = await this.coursesRepository.addEditor(courseId, editorId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return { message: 'Editor added successfully', data: course };
  }

  async removeEditor(courseId: string, editorId: string) {
    const course = await this.coursesRepository.removeEditor(
      courseId,
      editorId,
    );
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return { message: 'Editor removed successfully', data: course };
  }

  async findByInstructor(instructorId: string) {
    return this.coursesRepository.findByInstructor(instructorId);
  }

  countByInstructor(instructorId: string) {
    return this.coursesRepository.countByInstructor(instructorId);
  }

  countDistinctStudentsForInstructor(instructorId: string) {
    return this.coursesRepository.countDistinctStudentsForInstructor(
      instructorId,
    );
  }

  async archiveByOrganization(organizationId: string) {
    const result = await this.coursesRepository.updateMany(
      { organizationId },
      {
        $set: {
          isArchived: true,
          archivedAt: new Date(),
        },
      },
    );

    return {
      archivedCount: result.modifiedCount || 0,
    };
  }

  async permanentDeleteByOrganization(organizationId: string) {
    const result = await this.coursesRepository.deleteMany({ organizationId });
    return {
      deletedCount: result.deletedCount || 0,
    };
  }
}
