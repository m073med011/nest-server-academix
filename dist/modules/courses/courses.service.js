"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const courses_repository_1 = require("./courses.repository");
const payments_service_1 = require("../payments/payments.service");
const courses_dto_1 = require("./dto/courses.dto");
let CoursesService = class CoursesService {
    coursesRepository;
    paymentsService;
    constructor(coursesRepository, paymentsService) {
        this.coursesRepository = coursesRepository;
        this.paymentsService = paymentsService;
    }
    async create(createCourseDto, instructorId) {
        const courseData = { ...createCourseDto, instructor: instructorId };
        if (courseData.courseType === courses_dto_1.CourseType.ORGANIZATION) {
            courseData.enrollmentType = courses_dto_1.EnrollmentType.ORG_SUBSCRIPTION;
            courseData.isOrgPrivate = true;
            courseData.hasAccessRestrictions = false;
            courseData.price = 0;
            courseData.enrollmentCap = 0;
        }
        return this.coursesRepository.create(courseData);
    }
    async findAll(filterDto) {
        const page = filterDto.page || '1';
        const limit = filterDto.limit || '10';
        const { category, level, search, sort } = filterDto;
        const filter = {
            isPublished: true,
            $or: [
                { isOrgPrivate: false },
                { isOrgPrivate: { $exists: false } },
                { organizationId: { $exists: false } },
            ],
        };
        if (category)
            filter.category = category;
        if (level)
            filter.level = level;
        if (search) {
            filter.$text = { $search: search };
        }
        let sortOption = { createdAt: -1 };
        if (sort) {
            switch (sort) {
                case 'popular':
                    sortOption = { students: -1 };
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
    async findOne(id) {
        const course = await this.coursesRepository.findById(id, {
            populate: [
                { path: 'instructor', select: 'name email imageProfileUrl' },
                { path: 'modules.items.materialId' },
            ],
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return course;
    }
    async update(id, updateCourseDto) {
        const course = await this.coursesRepository.update(id, updateCourseDto);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return course;
    }
    async remove(id) {
        const course = await this.coursesRepository.delete(id);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return { message: 'Course deleted successfully' };
    }
    async enroll(courseId, userId) {
        const course = await this.coursesRepository.addStudent(courseId, userId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return { message: 'Successfully enrolled in course', data: course };
    }
    async unenroll(courseId, userId) {
        const course = await this.coursesRepository.removeStudent(courseId, userId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return { message: 'Successfully unenrolled from course', data: course };
    }
    async getUserPurchasedCourses(userId) {
        const courses = await this.paymentsService.getUserPurchasedCourses(userId);
        return {
            success: true,
            data: courses,
            totalCount: courses.length,
        };
    }
    async addEditor(courseId, editorId) {
        const course = await this.coursesRepository.addEditor(courseId, editorId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return { message: 'Editor added successfully', data: course };
    }
    async removeEditor(courseId, editorId) {
        const course = await this.coursesRepository.removeEditor(courseId, editorId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return { message: 'Editor removed successfully', data: course };
    }
    async findByInstructor(instructorId) {
        return this.coursesRepository.findByInstructor(instructorId);
    }
    countByInstructor(instructorId) {
        return this.coursesRepository.countByInstructor(instructorId);
    }
    countDistinctStudentsForInstructor(instructorId) {
        return this.coursesRepository.countDistinctStudentsForInstructor(instructorId);
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [courses_repository_1.CoursesRepository,
        payments_service_1.PaymentsService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map