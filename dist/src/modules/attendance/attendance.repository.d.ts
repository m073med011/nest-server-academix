import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';
export declare class AttendanceRepository {
    private attendanceModel;
    constructor(attendanceModel: Model<AttendanceDocument>);
    create(createAttendanceDto: any): Promise<Attendance>;
    findAll(): Promise<Attendance[]>;
    findById(id: string): Promise<Attendance | null>;
    update(id: string, updateAttendanceDto: any): Promise<Attendance | null>;
    delete(id: string): Promise<Attendance | null>;
}
