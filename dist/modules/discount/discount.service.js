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
exports.DiscountService = void 0;
const common_1 = require("@nestjs/common");
const discount_repository_1 = require("./discount.repository");
const discount_schema_1 = require("./schemas/discount.schema");
const courses_service_1 = require("../courses/courses.service");
let DiscountService = class DiscountService {
    discountRepository;
    coursesService;
    constructor(discountRepository, coursesService) {
        this.discountRepository = discountRepository;
        this.coursesService = coursesService;
    }
    create(createDiscountDto) {
        return this.discountRepository.create(createDiscountDto);
    }
    findAll() {
        return this.discountRepository.findAll();
    }
    findOne(id) {
        return this.discountRepository.findById(id);
    }
    findByCode(code) {
        return this.discountRepository.findByCode(code);
    }
    update(id, updateDiscountDto) {
        return this.discountRepository.update(id, updateDiscountDto);
    }
    remove(id) {
        return this.discountRepository.delete(id);
    }
    async validateDiscount(code, courseIds) {
        const discount = await this.discountRepository.findActiveByCode(code);
        if (!discount) {
            return {
                valid: false,
                discountAmount: 0,
                finalAmount: 0,
                message: 'Invalid or inactive discount code',
            };
        }
        if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
            return {
                valid: false,
                discountAmount: 0,
                finalAmount: 0,
                message: 'Discount code has expired',
            };
        }
        if (discount.maxUses && discount.usedCount >= discount.maxUses) {
            return {
                valid: false,
                discountAmount: 0,
                finalAmount: 0,
                message: 'Discount code has reached maximum usage limit',
            };
        }
        const isCartPurchase = courseIds.length > 1;
        if (discount.applicableOn === discount_schema_1.ApplicableOn.SINGLE_ONLY && isCartPurchase) {
            return {
                valid: false,
                discountAmount: 0,
                finalAmount: 0,
                message: 'This discount code is only applicable for single course purchases',
            };
        }
        if (discount.type === discount_schema_1.DiscountType.COURSE_SPECIFIC) {
            if (!discount.courseId || !courseIds.includes(discount.courseId)) {
                return {
                    valid: false,
                    discountAmount: 0,
                    finalAmount: 0,
                    message: 'This discount code is not applicable for the selected course(s)',
                };
            }
        }
        let totalAmount = 0;
        for (const courseId of courseIds) {
            try {
                const course = await this.coursesService.findOne(courseId);
                if (course) {
                    totalAmount += course.price || 0;
                }
            }
            catch (error) {
                continue;
            }
        }
        let discountAmount = 0;
        if (discount.valueType === discount_schema_1.DiscountValueType.PERCENTAGE) {
            discountAmount = (totalAmount * discount.value) / 100;
        }
        else if (discount.valueType === discount_schema_1.DiscountValueType.FIXED) {
            discountAmount = discount.value;
        }
        discountAmount = Math.min(discountAmount, totalAmount);
        const finalAmount = Math.max(0, totalAmount - discountAmount);
        return {
            valid: true,
            discount: {
                _id: discount._id,
                code: discount.code,
                type: discount.type,
                value: discount.value,
                valueType: discount.valueType,
            },
            discountAmount,
            finalAmount,
            message: 'Discount code applied successfully',
        };
    }
    async incrementUsageCount(discountId) {
        const discount = await this.discountRepository.findById(discountId);
        if (discount) {
            await this.discountRepository.update(discountId, {
                usedCount: discount.usedCount + 1,
            });
        }
    }
};
exports.DiscountService = DiscountService;
exports.DiscountService = DiscountService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => courses_service_1.CoursesService))),
    __metadata("design:paramtypes", [discount_repository_1.DiscountRepository,
        courses_service_1.CoursesService])
], DiscountService);
//# sourceMappingURL=discount.service.js.map