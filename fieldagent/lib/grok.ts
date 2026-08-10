import OpenAI from "openai";

/**
 * xAI's Grok API is OpenAI-SDK compatible — same client, different base URL and key.
 * https://docs.x.ai/docs/api-reference
 */
export const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

/** Recommended flagship model per xAI's own docs — "most intelligent and fastest". */
export const GROK_MODEL = "grok-4.5";
