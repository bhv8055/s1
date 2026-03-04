"use server";

import { z } from "zod";
import {
  analyzeHealth,
  type HealthAnalysisOutput,
} from "@/ai/flows/health-analyzer-flow";

const healthAnalysisSchema = z.object({
  prompt: z.string().optional(),
  photoDataUri: z.string().optional(),
});

export interface AnalysisState {
  message?: string | null;
  result?: HealthAnalysisOutput | null;
  error?: string | null;
  fieldErrors?: {
    prompt?: string[];
    photoDataUri?: string[];
  };
}

export async function handleHealthAnalysis(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
    const rawData = {
        prompt: formData.get("prompt"),
        photoDataUri: formData.get("photoDataUri"),
    };
    const validatedFields = healthAnalysisSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      error: "Invalid input.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { prompt, photoDataUri } = validatedFields.data;

  if (!prompt && !photoDataUri) {
      return {
          message: "Validation failed.",
          error: "Please provide either a description or an image.",
          fieldErrors: {
              prompt: ["Please provide a description or upload an image."],
          }
      }
  }

  if (prompt && prompt.length < 10 && !photoDataUri) {
      return {
          message: "Validation failed.",
          error: "Description too short.",
          fieldErrors: {
              prompt: ["Please provide at least 10 characters if not uploading an image."]
          }
      }
  }

  try {
    const result = await analyzeHealth({
      prompt: prompt || "Analyze the attached image.",
      photoDataUri: photoDataUri,
    });
    return { message: "Analysis complete.", result };
  } catch (e: any) {
    return {
      message: "Analysis failed.",
      error: e.message || "An unknown error occurred.",
    };
  }
}
