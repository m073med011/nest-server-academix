import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { PaymentsService } from '../payments/payments.service';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CourseFilterDto,
} from './dto/courses.dto';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(createCourseDto: CreateCourseDto, instructorId: string) {
    const courseData = { ...createCourseDto, instructor: instructorId };
    return this.coursesRepository.create(courseData);
  }

  async findAll(filterDto: CourseFilterDto) {
    const { page = '1', limit = '10', category, level, search } = filterDto;

    const filter: any = { isPublished: true };

    // Filter out private organization courses from public search
    filter.$or = [
      { isOrgPrivate: false },
      { isOrgPrivate: { $exists: false } },
      { organizationId: { $exists: false } },
    ];

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$text = { $search: search };
    }

    const options = {
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      sort: '-createdAt',
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
    const course = await this.coursesRepository.findById(id);
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
}
