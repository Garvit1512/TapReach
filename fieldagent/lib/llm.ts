import OpenAI from "openai";
import { getGrokClient, GROK_MODEL } from "./grok";

/**
 * Provider abstraction. LLM_PROVIDER selects which backend serves every command.
 *
 *   openrouter (default) — free-tier testing, zero cost by design. See the guard
 *     in assertUsableModel() below: this refuses to run against anything that
 *     isn't a `:free`-suffixed model, because OpenRouter will happily bill a
 *     misconfigured OPENROUTER_MODEL at full price.
 *   grok — xAI, added earlier — unchanged, still costs real money per call.
 *
 * There is no "anthropic" option. The app fully migrated off Anthropic to Grok
 * earlier in this build; nothing Anthropic-shaped is left to preserve.
 */

export type ProviderId = "openrouter" | "grok";

export interface ActiveProvider {
  id: ProviderId;
  client: OpenAI;
  model: string;
  /**
   * Whether this provider/model combination can actually do live web search
   * for free right now. False for OpenRouter — see the module doc above.
   */
  webSearchAvailable: boolean;
  /** Where to top up / get a key, for error messages. */
  consoleUrl: string;
}

const DEFAULT_OPENROUTER_MODEL = "openai/gpt-oss-20b:free";

class ConfigError extends Error {}

function assertFreeModel(model: string) {
  if (!model.endsWith(":free")) {
    throw new ConfigError(
      `OPENROUTER_MODEL="${model}" is not a free-tier model (no ":free" suffix). ` +
        `Refusing to run it — this would bill your OpenRouter account. Pick a model ` +
        `from https://openrouter.ai/models?max_price=0, or unset OPENROUTER_MODEL to ` +
        `use the default (${DEFAULT_OPENROUTER_MODEL}).`,
    );
  }
}

let cached: { provider: ActiveProvider } | null = null;

export function getProvider(): ActiveProvider {
  if (cached) return cached.provider;

  const id = (process.env.LLM_PROVIDER?.trim() || "openrouter") as ProviderId;

  let provider: ActiveProvider;

  if (id === "grok") {
    if (!process.env.XAI_API_KEY) {
      throw new ConfigError("LLM_PROVIDER=grok but XAI_API_KEY is not set.");
    }
    provider = {
      id: "grok",
      client: getGrokClient(),
      model: GROK_MODEL,
      webSearchAvailable: true,
      consoleUrl: "console.x.ai",
    };
  } else if (id === "openrouter") {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new ConfigError("LLM_PROVIDER=openrouter but OPENROUTER_API_KEY is not set.");
    }
    const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL;
    assertFreeModel(model);

    provider = {
      id: "openrouter",
      client: new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      }),
      model,
      // Web search costs extra on every OpenRouter model, free tier included
      // (OpenRouter's own docs: "Using web search will incur extra costs, even
      // with free models"). Never enable it implicitly.
      webSearchAvailable: false,
      consoleUrl: "openrouter.ai",
    };
  } else {
    throw new ConfigError(`Unknown LLM_PROVIDER="${id}". Use "openrouter" or "grok".`);
  }

  cached = { provider };
  return provider;
}

export { ConfigError };
