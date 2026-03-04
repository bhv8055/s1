'use server';
/**
 * @fileOverview An AI agent for analyzing heart-related symptoms.
 *
 * - analyzeHeartSymptoms - A function that handles the heart symptom analysis process.
 * - AnalyzeHeartSymptomsInput - The input type for the analyzeHeartSymptoms function.
 * - AnalyzeHeartSymptomsOutput - The return type for the analyzeHeartSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeHeartSymptomsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the heart-related symptoms.'),
});
export type AnalyzeHeartSymptomsInput = z.infer<
  typeof AnalyzeHeartSymptomsInputSchema
>;

const AnalyzeHeartSymptomsOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the potential heart disease.'),
  cause: z
    .string()
    .describe('The likely cause(s) or contributing factors of the condition.'),
  treatment: z
    .string()
    .describe('Recommended medicines or treatment approaches.'),
  routine: z
    .string()
    .describe('A daily routine or lifestyle changes to be followed.'),
  encouragement: z
    .string()
    .describe(
      'Supportive and encouraging words to reassure the user and reduce fear.'
    ),
});
export type AnalyzeHeartSymptomsOutput = z.infer<
  typeof AnalyzeHeartSymptomsOutputSchema
>;

export async function analyzeHeartSymptoms(
  input: AnalyzeHeartSymptomsInput
): Promise<AnalyzeHeartSymptomsOutput> {
  return analyzeHeartSymptomsFlow(input);
}

const analyzeHeartSymptomsPrompt = ai.definePrompt({
  name: 'analyzeHeartSymptomsPrompt',
  input: {schema: AnalyzeHeartSymptomsInputSchema},
  output: {schema: AnalyzeHeartSymptomsOutputSchema},
  prompt: `You are an AI medical assistant specializing in heart disease analysis.

Based on the user's provided heart-related symptoms, you need to provide a comprehensive assessment.

Your output should include the following:
1. The potential name of the cardiovascular disease.
2. The likely cause(s) of this condition.
3. Recommended medicines or treatment approaches.
4. A routine or lifestyle changes that the user should follow.
5. Encouraging words to help the user cope with the diagnosis and not feel scared.

User's Symptoms: {{{symptoms}}}`,
});

const analyzeHeartSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeHeartSymptomsFlow',
    inputSchema: AnalyzeHeartSymptomsInputSchema,
    outputSchema: AnalyzeHeartSymptomsOutputSchema,
  },
  async (input) => {
    const {output} = await analyzeHeartSymptomsPrompt(input);
    return output!;
  }
);
