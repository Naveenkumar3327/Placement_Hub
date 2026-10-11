import { NextRequest, NextResponse } from "next/server";

const translationModels: Record<string, string> = {
  "hi-IN": "Helsinki-NLP/opus-mt-hi-en",
  "es-ES": "Helsinki-NLP/opus-mt-es-en",
  "fr-FR": "Helsinki-NLP/opus-mt-fr-en",
};

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLanguage } = await req.json();
    if (typeof text !== "string" || !text.trim() || text.length > 5000) {
      return NextResponse.json({ message: "Provide a transcript between 1 and 5,000 characters." }, { status: 400 });
    }

    const model = translationModels[sourceLanguage];
    if (!model) {
      return NextResponse.json({ message: "Choose a supported source language before translating." }, { status: 400 });
    }

    const token = process.env.HUGGINGFACE_API_TOKEN || process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json(
        { message: "Translation is not configured. Add HUGGINGFACE_API_TOKEN on the server." },
        { status: 503 }
      );
    }

    const response = await fetch(`https://router.huggingface.co/hf-inference/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text.trim() }),
      signal: AbortSignal.timeout(30000),
    });

    const result = await response.json();
    if (!response.ok) {
      const message = typeof result.error === "string" ? result.error : "The translation model could not process this transcript.";
      return NextResponse.json({ message }, { status: response.status === 503 ? 503 : 502 });
    }

    const translatedText = Array.isArray(result)
      ? result[0]?.translation_text
      : result?.translation_text;
    if (typeof translatedText !== "string" || !translatedText.trim()) {
      return NextResponse.json({ message: "The translation model returned an empty result." }, { status: 502 });
    }

    return NextResponse.json({ translatedText, model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Translation failed.";
    return NextResponse.json({ message }, { status: 502 });
  }
}