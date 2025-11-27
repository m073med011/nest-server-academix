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
exports.ChatSchema = exports.Chat = exports.ChatType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_schema_1 = require("../../courses/schemas/course.schema");
var ChatType;
(function (ChatType) {
    ChatType["PRIVATE"] = "private";
    ChatType["COURSE"] = "course";
    ChatType["SYSTEM"] = "system";
})(ChatType || (exports.ChatType = ChatType = {}));
let Chat = class Chat {
    type;
    participants;
    courseId;
    name;
    lastMessage;
    lastMessageTime;
};
exports.Chat = Chat;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ChatType }),
    __metadata("design:type", String)
], Chat.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }],
        required: true,
    }),
    __metadata("design:type", Array)
], Chat.prototype, "participants", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Course' }),
    __metadata("design:type", course_schema_1.Course)
], Chat.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Chat.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Chat.prototype, "lastMessage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Chat.prototype, "lastMessageTime", void 0);
exports.Chat = Chat = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Chat);
exports.ChatSchema = mongoose_1.SchemaFactory.createForClass(Chat);
exports.ChatSchema.index({ participants: 1 });
exports.ChatSchema.index({ courseId: 1 });
//# sourceMappingURL=chat.schema.js.map