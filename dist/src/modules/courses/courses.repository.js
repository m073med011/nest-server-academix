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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_schema_1 = require("./schemas/course.schema");
let CoursesRepository = class CoursesRepository {
    courseModel;
    constructor(courseModel) {
        this.courseModel = courseModel;
    }
    async create(createCourseDto) {
        const newCourse = new this.courseModel(createCourseDto);
        return newCourse.save();
    }
    async findAll(filter = {}, options = {}) {
        return this.courseModel
            .find(filter)
            .skip(options.skip)
            .limit(options.limit)
            .sort(options.sort)
            .exec();
    }
    async count(filter = {}) {
        return this.courseModel.countDocuments(filter).exec();
    }
    async findById(id) {
        return this.courseModel.findById(id).exec();
    }
    async update(id, updateCourseDto) {
        return this.courseModel
            .findByIdAndUpdate(id, updateCourseDto, { new: true })
            .exec();
    }
    async delete(id) {
        return this.courseModel.findByIdAndDelete(id).exec();
    }
    async countByInstructor(instructorId) {
        return this.courseModel.countDocuments({ instructor: instructorId }).exec();
    }
    async countDistinctStudentsForInstructor(instructorId) {
        const result = await this.courseModel
            .aggregate([
            {
                $match: {
                    instructor: new this.courseModel.base.Types.ObjectId(instructorId),
                },
            },
            { $unwind: '$students' },
            { $group: { _id: null, students: { $addToSet: '$students' } } },
            { $project: { _id: 0, count: { $size: '$students' } } },
        ])
            .exec();
        return result[0]?.count || 0;
    }
    async addStudent(courseId, userId) {
        return this.courseModel
            .findByIdAndUpdate(courseId, { $addToSet: { students: userId } }, { new: true })
            .exec();
    }
    async addEditor(courseId, editorId) {
        return this.courseModel
            .findByIdAndUpdate(courseId, { $addToSet: { editors: editorId } }, { new: true })
            .exec();
    }
    async removeEditor(courseId, editorId) {
        return this.courseModel
            .findByIdAndUpdate(courseId, { $pull: { editors: editorId } }, { new: true })
            .exec();
    }
    async findByInstructor(instructorId) {
        return this.courseModel.find({ instructor: instructorId }).exec();
    }
};
exports.CoursesRepository = CoursesRepository;
exports.CoursesRepository = CoursesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CoursesRepository);
//# sourceMappingURL=courses.repository.js.map