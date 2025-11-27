import { AttendanceRepository } from './attendance.repository';
export declare class AttendanceService {
    private readonly attendanceRepository;
    constructor(attendanceRepository: AttendanceRepository);
    create(createAttendanceDto: any): Promise<import("./schemas/attendance.schema").Attendance>;
    findAll(): Promise<import("./schemas/attendance.schema").Attendance[]>;
    findOne(id: string): Promise<import("./schemas/attendance.schema").Attendance | null>;
    update(id: string, updateAttendanceDto: any): Promise<import("./schemas/attendance.schema").Attendance | null>;
    remove(id: string): Promise<import("./schemas/attendance.schema").Attendance | null>;
}
