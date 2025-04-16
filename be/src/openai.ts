// openai.ts
require("dotenv").config();

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // secure method
});

export default openai;
