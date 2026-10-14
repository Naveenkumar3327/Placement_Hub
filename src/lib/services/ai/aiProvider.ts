// Universal AI Provider supporting Google Gemini API, OpenAI API, and intelligent heuristic fallback

export interface AiPromptOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  provider?: "configured" | "huggingface";
}

export class AiProvider {
  private static getProvider(preference: AiPromptOptions["provider"] = "configured"): "gemini" | "openai" | "huggingface" | "fallback" {
    const provider = preference === "huggingface"
      ? "huggingface"
      : (process.env.AI_PROVIDER || "gemini").toLowerCase();
    if (provider === "gemini" && process.env.GEMINI_API_KEY) {
      return "gemini";
    }
    if (provider === "openai" && process.env.OPENAI_API_KEY) {
      return "openai";
    }
    if (provider === "huggingface" && process.env.HUGGINGFACE_API_TOKEN) {
      return "huggingface";
    }
    return "fallback";
  }

  public static getModelLabel(preference: AiPromptOptions["provider"] = "configured"): string {
    const provider = this.getProvider(preference);
    if (provider === "gemini") return process.env.GEMINI_MODEL || "Gemini 2.5 Flash";
    if (provider === "openai") return "OpenAI GPT-4o mini";
    if (provider === "huggingface") return process.env.HUGGINGFACE_MODEL || "Qwen/Qwen2.5-7B-Instruct";
    return "Local ATS writer";
  }

  public static async generateText(prompt: string, options: AiPromptOptions = {}): Promise<string> {
    const provider = this.getProvider(options.provider);

    if (provider === "gemini") {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: (options.systemPrompt ? `${options.systemPrompt}\n\n` : "") + prompt },
                ],
              },
            ],
            generationConfig: {
              temperature: options.temperature ?? 0.7,
              maxOutputTokens: options.maxTokens ?? 1500,
              responseMimeType: options.jsonMode ? "application/json" : "text/plain",
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) return candidateText;
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to heuristic engine:", err);
      }
    }

    if (provider === "openai") {
      try {
        const apiKey = process.env.OPENAI_API_KEY;
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              ...(options.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
              { role: "user", content: prompt },
            ],
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens ?? 1500,
            response_format: options.jsonMode ? { type: "json_object" } : undefined,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) return content;
        }
      } catch (err) {
        console.warn("OpenAI API call failed, falling back to heuristic engine:", err);
      }
    }

    if (provider === "huggingface") {
      try {
        const model = process.env.HUGGINGFACE_MODEL || "Qwen/Qwen2.5-7B-Instruct";
        const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              ...(options.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
              { role: "user", content: prompt },
            ],
            temperature: options.temperature ?? 0.3,
            max_tokens: options.maxTokens ?? 1800,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data?.choices?.[0]?.message?.content;
          if (typeof content === "string") return content;
        }
      } catch (err) {
        console.warn("Hugging Face model call failed, falling back to local ATS writer:", err);
      }
    }

    // Return empty string to signal heuristic fallback handler
    return "";
  }
}
