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
exports.CartSchema = exports.Cart = exports.CartItemSchema = exports.CartItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CartItem = class CartItem {
    courseId;
    addedDate;
};
exports.CartItem = CartItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Course', required: true }),
    __metadata("design:type", String)
], CartItem.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], CartItem.prototype, "addedDate", void 0);
exports.CartItem = CartItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CartItem);
exports.CartItemSchema = mongoose_1.SchemaFactory.createForClass(CartItem);
let Cart = class Cart {
    userId;
    items;
};
exports.Cart = Cart;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        ref: 'User',
        required: true,
        unique: true,
        index: true,
    }),
    __metadata("design:type", String)
], Cart.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.CartItemSchema], default: [] }),
    __metadata("design:type", Array)
], Cart.prototype, "items", void 0);
exports.Cart = Cart = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'carts' })
], Cart);
exports.CartSchema = mongoose_1.SchemaFactory.createForClass(Cart);
exports.CartSchema.index({ userId: 1 });
exports.CartSchema.index({ 'items.courseId': 1 });
exports.CartSchema.index({ createdAt: 1 });
exports.CartSchema.virtual('itemsWithCourses', {
    ref: 'Course',
    localField: 'items.courseId',
    foreignField: '_id',
});
exports.CartSchema.virtual('itemCount').get(function () {
    return this.items ? this.items.length : 0;
});
exports.CartSchema.virtual('totalPrice').get(function () {
    if (!this.items || this.items.length === 0)
        return 0;
    return this.items.reduce((sum, item) => {
        const course = item.courseId;
        if (course && typeof course === 'object' && course.price) {
            return sum + course.price;
        }
        return sum;
    }, 0);
});
exports.CartSchema.set('toJSON', { virtuals: true });
exports.CartSchema.set('toObject', { virtuals: true });
//# sourceMappingURL=cart.schema.js.map