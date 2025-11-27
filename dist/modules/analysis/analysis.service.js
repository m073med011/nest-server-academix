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
exports.AnalysisService = void 0;
const common_1 = require("@nestjs/common");
const courses_service_1 = require("../courses/courses.service");
const payments_service_1 = require("../payments/payments.service");
const users_service_1 = require("../users/users.service");
let AnalysisService = class AnalysisService {
    coursesService;
    paymentsService;
    usersService;
    constructor(coursesService, paymentsService, usersService) {
        this.coursesService = coursesService;
        this.paymentsService = paymentsService;
        this.usersService = usersService;
    }
    async getInstructorAnalysisSummary(instructorId) {
        const instructor = await this.usersService.findById(instructorId);
        if (!instructor) {
            throw new common_1.NotFoundException('Instructor not found');
        }
        const [ownCourseCount, purchasedCourseCount, totalRevenue, totalStudents] = await Promise.all([
            this.coursesService.countByInstructor(instructorId),
            this.paymentsService.countSuccessfulPurchasesByUser(instructorId),
            this.paymentsService.calculateTotalRevenueForInstructor(instructorId),
            this.coursesService.countDistinctStudentsForInstructor(instructorId),
        ]);
        return {
            instructorId,
            instructorName: instructor.name,
            ownCourseCount,
            purchasedCourseCount,
            totalRevenue,
            totalStudents,
        };
    }
};
exports.AnalysisService = AnalysisService;
exports.AnalysisService = AnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [courses_service_1.CoursesService,
        payments_service_1.PaymentsService,
        users_service_1.UsersService])
], AnalysisService);
//# sourceMappingURL=analysis.service.js.map