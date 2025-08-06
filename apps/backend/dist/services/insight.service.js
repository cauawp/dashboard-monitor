"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInsight = void 0;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("../config/env");
const openai = new openai_1.default({ apiKey: env_1.OPENAI_API_KEY });
const generateInsight = async (summary) => {
    const prompt = `Gere um insight com base nesses dados: ${summary}`;
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        // model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
};
exports.generateInsight = generateInsight;
