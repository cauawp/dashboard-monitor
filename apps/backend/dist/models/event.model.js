"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const EventSchema = new mongoose_1.default.Schema({
    userId: String,
    type: String,
    value: Number,
    timestamp: Date,
    metadata: Object,
}, { timestamps: true });
exports.default = mongoose_1.default.model('Event', EventSchema);
