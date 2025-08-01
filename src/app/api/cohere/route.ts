import { CohereClient } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";
import { generarPromptAnalisis } from "./prompt";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const {
      tipo,
      numeroID,
      nombre,
      descripcion,
      contextoProyecto,
    }: {
      tipo: string;
      numeroID: string;
      nombre: string;
      descripcion: string;
      contextoProyecto: string;
    } = await req.json();

    const prompt = generarPromptAnalisis({
      tipo,
      numeroID,
      nombre,
      descripcion,
      contextoProyecto,
    });

    const response = await cohere.chat({
      model: "command-r-plus",
      message: prompt,
      temperature: 0.3,
      maxTokens: 500,
    });

    const parsed = JSON.parse(response.text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[ERROR] Fallo en el análisis de ambigüedad:", error);
    return NextResponse.json({ error: "Error durante el análisis del requisito" }, { status: 500 });
  }
}
