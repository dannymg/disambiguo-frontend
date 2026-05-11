import { CohereClientV2 } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";
import { generarPromptAnalisis } from "./prompt";

export async function POST(req: NextRequest) {
  try {
    const cohere = new CohereClientV2({
      token: process.env.COHERE_API_KEY!,
    });

    const { tipo, numeroID, nombre, descripcion, contextoProyecto } = await req.json();

    const prompt = generarPromptAnalisis({
      tipo,
      numeroID,
      nombre,
      descripcion,
      contextoProyecto,
    });

    const response = await cohere.chat({
      model: "command-a-03-2025",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.message?.content?.[0]?.text ?? "";

    const clean = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[COHERE ERROR]", error);

    return NextResponse.json(
      {
        error: "Error durante el análisis del requisito",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
