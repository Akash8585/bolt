"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const openai_1 = __importDefault(require("openai"));
const cors_1 = __importDefault(require("cors"));
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.post("/template", async (req, res) => {
    var _a, _b, _c;
    const prompt = req.body.prompt;
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "Return either node or react based on what you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        max_tokens: 10,
    });
    const answer = (_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim().toLowerCase();
    if (answer === "react") {
        res.json({
            prompts: [
                prompts_1.BASE_PROMPT,
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [react_1.basePrompt],
        });
        return;
    }
    if (answer === "node") {
        res.json({
            prompts: [
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [node_1.basePrompt],
        });
        return;
    }
    res.status(403).json({ message: "You can't access this" });
});
app.post("/chat", async (req, res) => {
    var _a, _b, _c;
    const messages = req.body.messages;
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: (0, prompts_1.getSystemPrompt)(),
            },
            ...messages,
        ],
        max_tokens: 8000,
    });
    res.json({
        response: (_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim(),
    });
});
app.listen(3000, () => console.log("Server running on port 3000"));
