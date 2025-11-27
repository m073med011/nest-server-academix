import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
  ) {}

  async create(createAttendanceDto: any): Promise<Attendance> {
    const newAttendance = new this.attendanceModel(createAttendanceDto);
    return newAttendance.save();
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceModel.find().exec();
  }

  async findById(id: string): Promise<Attendance | null> {
    return this.attendanceModel.findById(id).exec();
  }

  async update(
    id: string,
    updateAttendanceDto: any,
  ): Promise<Attendance | null> {
    return this.attendanceModel
      .findByIdAndUpdate(id, updateAttendanceDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Attendance | null> {
    return this.attendanceModel.findByIdAndDelete(id).exec();
  }
}
