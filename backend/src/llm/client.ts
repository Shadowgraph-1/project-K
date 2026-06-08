import OpenAI from "openai";

export type LlmSettings = {
  baseURL: string;
  apiKey: string;
  model: string;
};

export function createLlmSettings(): LlmSettings {
  return {
    baseURL: process.env.LM_BASE_URL ?? "http://localhost:1234/v1",
    apiKey: process.env.LM_API_KEY ?? "no-key",
    model: process.env.LM_MODEL ?? "gemma-4-e4b-it",
  };
}

export function createLlmClient(settings = createLlmSettings()) {
    const client = new OpenAI({
        baseURL: settings.baseURL,
        apiKey: settings.baseURL,
    });

    return {
        client, model: settings.model
    };
}

export const llm = createLlmClient();