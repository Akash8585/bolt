require("dotenv").config();
import express from "express";
import OpenAI from "openai";
import cors from "cors";

import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;

  const response = await openai.chat.completions.create({
    model: "gpt-4o", 
    messages: [
      {
        role: "system",
        content:
          "Return either node or react based on what you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 10,
  });

  const answer = response.choices[0]?.message?.content?.trim().toLowerCase();

  if (answer === "react") {
    res.json({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactBasePrompt],
    });
    return;
  }

  if (answer === "node") {
    res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nodeBasePrompt],
    });
    return;
  }

  res.status(403).json({ message: "You can't access this" });
});

app.post("/chat", async (req, res) => {
  const messages = req.body.messages;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: getSystemPrompt(),
      },
      ...messages,
    ],
    max_tokens: 8000,
  });

  res.json({
    response: response.choices[0]?.message?.content?.trim(),
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
