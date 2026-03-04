"use server";

import { z } from "zod";
import {
  analyzeHeartSymptoms,
  type AnalyzeHeartSymptomsOutput,
} from "@/ai/flows/analyze-heart-symptoms";
import {
  analyzeSkinCondition,
  type AnalyzeSkinConditionOutput,
} from "@/ai/flows/analyze-skin-condition";

const heartSymptomSchema = z.object({
  symptoms: z.string().min(10, "Please provide a more detailed description of your symptoms."),
});

export interface HeartAnalysisState {
  message?: string | null;
  result?: AnalyzeHeartSymptomsOutput | null;
  error?: string | null;
  fieldErrors?: {
    symptoms?: string[];
  };
}

export async function handleHeartAnalysis(
  prevState: HeartAnalysisState,
  formData: FormData
): Promise<HeartAnalysisState> {
  const validatedFields = heartSymptomSchema.safeParse({
    symptoms: formData.get("symptoms"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      error: "Invalid input.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await analyzeHeartSymptoms({
      symptoms: validatedFields.data.symptoms,
    });
    return { message: "Analysis complete.", result };
  } catch (e: any) {
    return {
      message: "Analysis failed.",
      error: e.message || "An unknown error occurred.",
    };
  }
}

const skinConditionSchema = z.object({
  photoDataUri: z.string().min(1, "Image is required."),
  description: z.string().optional(),
});

export interface SkinAnalysisState {
  message?: string | null;
  result?: AnalyzeSkinConditionOutput | null;
  error?: string | null;
  fieldErrors?: {
    photoDataUri?: string[];
  };
}

export async function handleSkinAnalysis(
  prevState: SkinAnalysisState,
  formData: FormData
): Promise<SkinAnalysisState> {
  const validatedFields = skinConditionSchema.safeParse({
    photoDataUri: formData.get("photoDataUri"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      error: "Invalid input.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await analyzeSkinCondition({
      photoDataUri: validatedFields.data.photoDataUri,
      description: validatedFields.data.description,
    });
    return { message: "Analysis complete.", result };
  } catch (e: any) {
    return {
      message: "Analysis failed.",
      error: e.message || "An unknown error occurred.",
    };
  }
}
