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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const attendance_repository_1 = require("./attendance.repository");
let AttendanceService = class AttendanceService {
    attendanceRepository;
    constructor(attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }
    create(createAttendanceDto) {
        return this.attendanceRepository.create(createAttendanceDto);
    }
    findAll() {
        return this.attendanceRepository.findAll();
    }
    findOne(id) {
        return this.attendanceRepository.findById(id);
    }
    update(id, updateAttendanceDto) {
        return this.attendanceRepository.update(id, updateAttendanceDto);
    }
    remove(id) {
        return this.attendanceRepository.delete(id);
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendance_repository_1.AttendanceRepository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map