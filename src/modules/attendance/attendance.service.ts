import { Injectable } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  create(createAttendanceDto: any) {
    return this.attendanceRepository.create(createAttendanceDto);
  }

  findAll() {
    return this.attendanceRepository.findAll();
  }

  findOne(id: string) {
    return this.attendanceRepository.findById(id);
  }

  update(id: string, updateAttendanceDto: any) {
    return this.attendanceRepository.update(id, updateAttendanceDto);
  }

  remove(id: string) {
    return this.attendanceRepository.delete(id);
  }
}
