import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "GEMINI_API_KEY missing in .env.local file" },
        { status: 500 }
      );
    }

    // 1. Get uploaded file from Request
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No resume file uploaded" },
        { status: 400 }
      );
    }

    // 2. Extract text from PDF
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const pdfParse = (await import("pdf-parse")).default;
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json(
        { success: false, message: "Could not extract text from PDF file" },
        { status: 400 }
      );
    }

    // 3. Dynamic Model Discovery (Prevents 404 Not Found)
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();

    if (!listRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Google API rejected API key. Please generate a new key in Google AI Studio.",
          error: listData,
        },
        { status: 401 }
      );
    }

    // Extract models supported by your account/key
    const availableModels = listData.models
      ?.filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
      ?.map((m: any) => m.name.replace("models/", "")) || [];

    if (availableModels.length === 0) {
      return NextResponse.json(
        { success: false, message: "No text generation models available for this key." },
        { status: 400 }
      );
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) scanner. 
Analyze the following resume text and return ONLY a valid raw JSON object. Do NOT wrap it in backticks or markdown fences.

Strict JSON Output Schema:
{
  "score": 85,
  "strengths": ["Strength point 1", "Strength point 2"],
  "missingSkills": ["Missing skill 1", "Missing skill 2"],
  "suggestions": ["Actionable advice 1", "Actionable advice 2"]
}

Resume Text:
${resumeText}`;

    let parsedData = null;
    let usedModel = "";

    // 4. Try request on active models sequentially
    for (const modelName of availableModels) {
      const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(generateUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        const resJson = await response.json();

        if (response.ok && resJson.candidates?.[0]?.content?.parts?.[0]?.text) {
          const rawText = resJson.candidates[0].content.parts[0].text;
          const cleanedText = rawText.replace(/```json\n?|\n?```/g, "").trim();
          parsedData = JSON.parse(cleanedText);
          usedModel = modelName;
          break;
        }
      } catch (err) {
        console.warn(`Attempt with ${modelName} failed, trying next available model...`);
      }
    }

    if (!parsedData) {
      return NextResponse.json(
        { success: false, message: "Could not generate analysis from available models." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      usedModel: usedModel,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}