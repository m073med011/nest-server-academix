import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';

@Injectable()
export class CoursesRepository {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async create(createCourseDto: any): Promise<Course> {
    const newCourse = new this.courseModel(createCourseDto);
    return newCourse.save();
  }

  async findAll(
    filter: FilterQuery<CourseDocument> = {},
    options: any = {},
  ): Promise<Course[]> {
    return this.courseModel
      .find(filter)
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort)
      .populate({
        path: 'instructor',
        select: 'name email role imageProfileUrl',
      })
      .exec();
  }

  async count(filter: FilterQuery<CourseDocument> = {}): Promise<number> {
    return this.courseModel.countDocuments(filter).exec();
  }

  async findById(id: string, options: any = {}): Promise<Course | null> {
    const query = this.courseModel.findById(id);

    if (options.populate) {
      query.populate(options.populate);
    } else {
      // Default population if none specified
      query.populate({
        path: 'instructor',
        select: 'name email role imageProfileUrl',
      });
    }

    return query.exec();
  }

  async update(id: string, updateCourseDto: any): Promise<Course | null> {
    return this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Course | null> {
    return this.courseModel.findByIdAndDelete(id).exec();
  }

  async countByInstructor(instructorId: string): Promise<number> {
    return this.courseModel.countDocuments({ instructor: instructorId }).exec();
  }

  async countDistinctStudentsForInstructor(
    instructorId: string,
  ): Promise<number> {
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

  async addStudent(courseId: string, userId: string): Promise<Course | null> {
    return this.courseModel
      .findByIdAndUpdate(
        courseId,
        { $addToSet: { students: userId } },
        { new: true },
      )
      .exec();
  }

  async removeStudent(
    courseId: string,
    userId: string,
  ): Promise<Course | null> {
    return this.courseModel
      .findByIdAndUpdate(
        courseId,
        { $pull: { students: userId } },
        { new: true },
      )
      .exec();
  }

  async addEditor(courseId: string, editorId: string): Promise<Course | null> {
    return this.courseModel
      .findByIdAndUpdate(
        courseId,
        { $addToSet: { editors: editorId } },
        { new: true },
      )
      .exec();
  }

  async removeEditor(
    courseId: string,
    editorId: string,
  ): Promise<Course | null> {
    return this.courseModel
      .findByIdAndUpdate(
        courseId,
        { $pull: { editors: editorId } },
        { new: true },
      )
      .exec();
  }

  async findByInstructor(instructorId: string): Promise<Course[]> {
    return this.courseModel
      .find({ instructor: instructorId })
      .populate({
        path: 'instructor',
        select: 'name email role imageProfileUrl',
      })
      .exec();
  }
}
