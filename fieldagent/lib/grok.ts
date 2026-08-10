import OpenAI from "openai";

/**
 * xAI's Grok API is OpenAI-SDK compatible — same client, different base URL and key.
 * https://docs.x.ai/docs/api-reference
 *
 * The client is built lazily, not as a module-scope constant. `new OpenAI(...)`
 * throws immediately if `apiKey` is undefined ("Missing credentials..."), and this
 * module is statically imported by lib/llm.ts, which app/api/agent/route.ts always
 * imports — regardless of which provider LLM_PROVIDER actually selects. A
 * module-scope `export const grok = new OpenAI(...)` therefore ran during Next's
 * "Collecting page data" build step on every deploy, and threw there whenever
 * XAI_API_KEY wasn't set — which is exactly the case for an OpenRouter-only
 * deployment. Wrapping construction in a function means nothing runs until
 * getGrokClient() is actually called, which only happens at request time, inside
 * getProvider()'s "grok" branch.
 */
export function getGrokClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
  });
}

/** Recommended flagship model per xAI's own docs — "most intelligent and fastest". */
export const GROK_MODEL = "grok-4.5";
