import OpenAI from "openai";
import { env } from "../config/env.js";

export type LlmSettings = {
  baseURL: string;
  apiKey: string;
  model: string;
};

export function createLlmSettings() {
  return {
    baseURL: env.LM_BASE_URL,
    apiKey: env.LM_API_KEY,
    model: env.LM_MODEL,
  };
}

export function createLlmClient(settings = createLlmSettings()) {
  const client = new OpenAI({
    baseURL: settings.baseURL,
    apiKey: settings.apiKey,
  });

  return {
    client,
    model: settings.model,
  };
}

export const llm = createLlmClient();
