"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGOMS_DOWNLOAD_DIR = exports.JWT_SECRET = exports.OPENAI_API_KEY = exports.MONGODB_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 3001;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.MONGOMS_DOWNLOAD_DIR = process.env.MONGOMS_DOWNLOAD_DIR;
