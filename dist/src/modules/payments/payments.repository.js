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
exports.PaymentsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("./schemas/payment.schema");
let PaymentsRepository = class PaymentsRepository {
    paymentModel;
    constructor(paymentModel) {
        this.paymentModel = paymentModel;
    }
    async create(createPaymentDto) {
        const newPayment = new this.paymentModel(createPaymentDto);
        return newPayment.save();
    }
    async findAll() {
        return this.paymentModel.find().exec();
    }
    async findById(id) {
        return this.paymentModel.findById(id).exec();
    }
    async update(id, updatePaymentDto) {
        return this.paymentModel
            .findByIdAndUpdate(id, updatePaymentDto, { new: true })
            .exec();
    }
    async delete(id) {
        return this.paymentModel.findByIdAndDelete(id).exec();
    }
    async countSuccessfulPurchasesByUser(userId) {
        return this.paymentModel
            .countDocuments({ userId, status: 'success' })
            .exec();
    }
    async calculateTotalRevenueForInstructor(instructorId) {
        const result = await this.paymentModel
            .aggregate([
            { $match: { status: 'success' } },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseIds',
                    foreignField: '_id',
                    as: 'courses',
                },
            },
            { $unwind: '$courses' },
            {
                $match: {
                    'courses.instructor': new this.paymentModel.base.Types.ObjectId(instructorId),
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                },
            },
        ])
            .exec();
        return result[0]?.totalRevenue || 0;
    }
    async findPurchasedCoursesByUser(userId) {
        const payments = await this.paymentModel
            .find({ userId, status: 'success' })
            .populate('courseIds')
            .exec();
        const courses = payments.flatMap((payment) => payment.courseIds);
        return courses;
    }
};
exports.PaymentsRepository = PaymentsRepository;
exports.PaymentsRepository = PaymentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PaymentsRepository);
//# sourceMappingURL=payments.repository.js.map