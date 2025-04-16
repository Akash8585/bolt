"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// openai.ts
require("dotenv").config();
const openai_1 = require("openai");
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // secure method
});
exports.default = openai;
